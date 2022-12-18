/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { inject, injectable, postConstruct } from 'inversify';
import { debounce, isEqual } from 'lodash';

import { DefaultResourceProvider, Disposable, Emitter, Event, ILogger, MaybePromise, Resource } from '@theia/core';
import { BaseWidget, codicon, Message, NavigatableWidget, Saveable, SaveableSource, SaveOptions } from '@theia/core/lib/browser';
import { EditorPreferences } from '@theia/editor/lib/browser';
import URI from '@theia/core/lib/common/uri';

import { ExampleJsonFormsModelService } from './example-jsonforms-model-service';
import { JsonFormsStyleContext, StyleContext, vanillaCells, vanillaRenderers, vanillaStyles } from '@jsonforms/vanilla-renderers';
import { JsonForms } from '@jsonforms/react';

export const NavigatableExampleJsonFormsOptions = Symbol(
    'NavigatableExampleJsonFormsOptions'
);
export interface NavigatableExampleJsonFormsOptions {
    uri: URI;
}

@injectable()
export class ExampleJsonFormsWidget extends BaseWidget implements NavigatableWidget, Saveable, SaveableSource {
    public dirty = false;
    public autoSave: 'off' | 'afterDelay' | 'onFocusChange' | 'onWindowChange' = 'off';
    public saveable: Saveable;

    protected autoSaveDelay: number;
    protected hostRoot: HTMLDivElement;

    protected readonly onDirtyChangedEmitter = new Emitter<void>();
    protected readonly onChangedEmitter = new Emitter<Readonly<any>>();
    protected resource: Resource;

    constructor(
        @inject(ILogger) readonly logger: ILogger,
        @inject(NavigatableExampleJsonFormsOptions)
        private readonly options: NavigatableExampleJsonFormsOptions,
        @inject(EditorPreferences)
        protected readonly editorPreferences: EditorPreferences,
        @inject(DefaultResourceProvider)
        protected provider: DefaultResourceProvider,
        @inject(ExampleJsonFormsModelService)
        protected readonly modelService: ExampleJsonFormsModelService
    ) {
        super();
    }

    @postConstruct()
    protected init(): void {
        this.id = ExampleJsonFormsWidget.WIDGET_ID;
        this.configureTitle();
        this.createHostRoot();
        this.configureEditorPreferences();
        this.configureEvents();
        this.loadResource();
        this.update();
    }

    get onDirtyChanged(): Event<void> {
        return this.onDirtyChangedEmitter.event;
    }

    get onChanged(): Event<Readonly<any>> {
        return this.onChangedEmitter.event;
    }

    /** The uri of the editor's resource. */
    get uri(): URI {
        return this.options.uri;
    }

    protected setDirty(dirty: boolean): void {
        if (this.dirty !== dirty) {
            this.dirty = dirty;
            this.onDirtyChangedEmitter.fire();
        }
    }

    protected configureTitle(): void {
        this.title.label = this.uri.path.base;
        this.title.caption = this.uri.toString();
        this.title.iconClass = codicon('json');
        this.title.closable = true;
    }

    protected createHostRoot(): void {
        this.hostRoot = document.createElement('div');
        this.hostRoot.className += 'example-jsonforms-widget-container';
        this.node.appendChild(this.hostRoot);
        this.node.style.overflowY = 'scroll';
        this.toDispose.push(Disposable.create(() => ReactDOM.unmountComponentAtNode(this.hostRoot)));
    }

    protected configureEditorPreferences(): void {
        this.autoSave = this.editorPreferences['files.autoSave'];
        this.autoSaveDelay = this.editorPreferences['files.autoSaveDelay'];
    }

    protected configureEvents(): void {
        this.editorPreferences.onPreferenceChanged(event => {
            switch(event.preferenceName) {
                case 'files.autoSave':
                    this.autoSave = event.newValue;
                    break;
                case 'files.autoSaveDelay':
                    this.autoSaveDelay = event.newValue;
            }
        });

        this.onDirtyChanged(_ => {
            if (this.autoSave !== 'off' && this.dirty) {
                this.saveDelayed();
            }
        });

        this.onChanged(
            debounce(data => {
                if (isEqual(this.modelService.data, data)) {
                    return;
                }
                this.handleFormUpdate(data);
            }, 250)
        );

        this.toDispose.push(this.onChangedEmitter);
        this.toDispose.push(this.onDirtyChangedEmitter);
    }

    loadResource(): void {
        this.provider.get(this.uri).then(
            resource => {
                this.resource = resource;
                this.toDispose.push(this.resource);
                this.load();
            },
            _ => console.error(`Could not create ressource for uri ${this.uri}`)
        );
    }

    protected async load(): Promise<void> {
        let content = undefined;
        try {
            content = await this.resource.readContents();
        } catch (e) {
            console.error(`Loading ${this.resource.uri} failed.`, e);
        }

        let json = undefined;
        try {
            json = JSON.parse(content!);
        } finally {
            this.setJsonFormsData(json);
        }
    }

    protected setJsonFormsData(data: object): void {
        this.modelService.setData(data);
        this.update();
    }

    protected handleFormUpdate(data: object): void {
        this.setJsonFormsData(data);
        this.handleChanged();
    }

    protected handleChanged(): void {
        if (this.autoSave !== 'off') {
            this.saveDelayed();
        } else {
            this.setDirty(true);
        }
    }

    getResourceUri(): URI | undefined {
        return this.uri;
    }

    getStyles(): StyleContext {
        return styleContextValue;
    }

    createMoveToUri(resourceUri: URI): URI | undefined {
        return this.uri && this.uri.withPath(resourceUri.path);
    }

    save(options?: SaveOptions | undefined): MaybePromise<void> {
        const content = JSON.stringify(this.modelService.data);
        this.resource.saveContents!(content).then(
            _ => this.setDirty(false),
            error => console.error(`Resource ${this.uri} could not be saved.`, error)
        );
    }

    saveDelayed(): void {
        const handle = window.setTimeout(() => {
            this.save();
            window.clearTimeout(handle);
        }, this.autoSaveDelay);
    }

    revert(options?: Saveable.RevertOptions | undefined): Promise<void> {
        return this.load();
    }

    createSnapshot(): Saveable.Snapshot {
        const state = JSON.stringify(this.modelService.data);
        return { value: state };
    }

    applySnapshot(snapshot: { value: string }): void {
        this.setJsonFormsData(JSON.parse(snapshot.value));
    }

    protected override onUpdateRequest(msg: Message): void {
        super.onUpdateRequest(msg);
        this.renderForms();
    }

    protected async renderForms(): Promise<void> {
        const data = this.modelService.data;
        const schema = await this.modelService.getSchema();
        const uiSchema = await this.modelService.getUiSchema();

        ReactDOM.render(
            <div className={ExampleJsonFormsWidget.JSON_FORMS_CONTAINER_CSS_CLASS}>
                <JsonFormsStyleContext.Provider value={this.getStyles()}>
                    <JsonForms
                        data={data}
                        schema={schema}
                        uischema={uiSchema}
                        cells={vanillaCells}
                        renderers={vanillaRenderers}
                        onChange={e => this.onChangedEmitter.fire(e.data)}
                    />
                </JsonFormsStyleContext.Provider>
            </div>,
            this.hostRoot
        );
    }
}

export namespace ExampleJsonFormsWidget {
    export const WIDGET_ID = 'example-jsonforms-editor-editor';
    export const LABEL = 'Example Json forms editor';
    export const JSON_FORMS_CONTAINER_CSS_CLASS = 'example-jsonforms-container';
}

export const styleContextValue: StyleContext = {
    styles: [
        ...vanillaStyles,
        {
            name: 'array.button',
            classNames: ['theia-button']
        },
        {
            name: 'array.table.button',
            classNames: ['theia-button']
        },
        {
            name: 'control.input',
            classNames: ['theia-input']
        },
        {
            name: 'control.select',
            classNames: ['theia-select']
        },
        {
            name: 'vertical.layout',
            classNames: ['theia-vertical']
        }
    ]
};

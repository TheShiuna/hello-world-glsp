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
import { DefaultResourceProvider, Disposable, Event, MaybePromise, Resource } from '@theia/core';
import { BaseWidget, NavigatableWidget, Saveable, SaveableSource, SaveOptions } from '@theia/core/lib/browser';
import { EditorPreferences } from '@theia/editor/lib/browser';
import URI from '@theia/core/lib/common/uri';

import { inject, injectable, postConstruct } from 'inversify';
import { PokemonApiFinderWidget } from './pokemon-api-finder-widget';
import { PokemonApiService } from './pokemon-api-service';
import { PokemonApiTeamWidget } from './pokemon-api-team-widget';

export const NavigatablePokemonApiEditorOptions = Symbol(
    'NavigatablePokemonApiEditorOptions'
);
export interface NavigatablePokemonApiEditorOptions {
    uri: URI;
}

@injectable()
export class PokemonApiEditorWidget extends BaseWidget implements NavigatableWidget, Saveable, SaveableSource {
    public dirty: boolean;
    public onDirtyChanged: Event<void>;
    public autoSave: 'off' | 'afterDelay' | 'onFocusChange' | 'onWindowChange';

    protected resource: Resource;

    constructor(
        @inject(PokemonApiFinderWidget)
        protected pokemonApiFinderWidget: PokemonApiFinderWidget,
        @inject(PokemonApiTeamWidget)
        protected pokemonApiTeamWidget: PokemonApiTeamWidget,
        @inject(PokemonApiService)
        protected pokemonApiService: PokemonApiService,
        @inject(EditorPreferences)
        protected readonly editorPreferences: EditorPreferences,
        @inject(DefaultResourceProvider)
        protected provider: DefaultResourceProvider,
        @inject(NavigatablePokemonApiEditorOptions)
        protected options: NavigatablePokemonApiEditorOptions

    ) {
        super();
    }

    @postConstruct()
    protected init(): void {
        // do nothing right now
    }

    getResourceUri(): URI | undefined {
        throw new Error('Method not implemented.');
    }
    createMoveToUri(resourceUri: URI): URI | undefined {
        throw new Error('Method not implemented.');
    }
    save(options?: SaveOptions | undefined): MaybePromise<void> {
        throw new Error('Method not implemented.');
    }
    revert?(options?: Saveable.RevertOptions | undefined): Promise<void> {
        throw new Error('Method not implemented.');
    }
    createSnapshot?(): Saveable.Snapshot {
        throw new Error('Method not implemented.');
    }
    applySnapshot?(snapshot: object): void {
        throw new Error('Method not implemented.');
    }
    saveable: Saveable;
}

export namespace PokemonApiEditorWidget {
    export const WIDGET_ID = 'pokemon-api-editor-editor';
    export const LABEL = 'Pokemon API editor';
    export const POKEMON_API_EDITOR_CONTAINER_CSS_CLASS = 'pokemon-api-editor-container';
}

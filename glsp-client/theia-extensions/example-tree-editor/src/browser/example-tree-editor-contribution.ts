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
import { BaseTreeEditorContribution, MasterTreeWidget, TreeEditor } from '@eclipse-emfcloud/theia-tree-editor';
import { ApplicationShell, NavigatableWidgetOptions, OpenerService, WidgetOpenerOptions } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { inject, injectable } from 'inversify';

import { ExampleTreeEditorWidget } from './tree/example-tree-editor-widget';
import { ExampleTreeLabelProvider } from './tree/example-tree-label-provider';
import { ExampleTreeModelService } from './tree/example-tree-model-service';

@injectable()
export class ExampleTreeEditorContribution extends BaseTreeEditorContribution {
    @inject(ApplicationShell) protected override shell: ApplicationShell;
    @inject(OpenerService) protected opener: OpenerService;

    constructor(
        @inject(ExampleTreeModelService) modelService: TreeEditor.ModelService,
        @inject(ExampleTreeLabelProvider) labelProvider: ExampleTreeLabelProvider
    ) {
        super(ExampleTreeEditorWidget.EDITOR_ID, modelService, labelProvider);
    }

    readonly id = ExampleTreeEditorWidget.WIDGET_ID;
    readonly label = MasterTreeWidget.WIDGET_LABEL;

    canHandle(uri: URI): number {
        return uri.path.ext === '.tree'
            ? 1000
            : 0;
    }
    protected createWidgetOptions(
        uri: URI,
        options?: WidgetOpenerOptions
    ): NavigatableWidgetOptions {
        return {
            kind: 'navigatable',
            uri: uri.withoutFragment().toString()
        };
    }
}

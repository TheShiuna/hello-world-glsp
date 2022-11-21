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
import {
    DetailFormWidget,
    MasterTreeWidget,
    NavigatableTreeEditorOptions,
    ResourceTreeEditorWidget,
    TreeEditor
} from '@eclipse-emfcloud/theia-tree-editor';
import { codicon, Title, Widget } from '@theia/core/lib/browser';
import { DefaultResourceProvider, ILogger } from '@theia/core/lib/common';
import { EditorPreferences } from '@theia/editor/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { inject, injectable } from 'inversify';

@injectable()
export class ExampleTreeEditorWidget extends ResourceTreeEditorWidget {
    constructor(
        @inject(MasterTreeWidget)
        override readonly treeWidget: MasterTreeWidget,
        @inject(DetailFormWidget)
        override readonly formWidget: DetailFormWidget,
        @inject(WorkspaceService)
        override readonly workspaceService: WorkspaceService,
        @inject(ILogger) override readonly logger: ILogger,
        @inject(NavigatableTreeEditorOptions)
        protected override readonly options: NavigatableTreeEditorOptions,
        @inject(DefaultResourceProvider)
        protected override provider: DefaultResourceProvider,
        @inject(TreeEditor.NodeFactory)
        protected override readonly nodeFactory: TreeEditor.NodeFactory,
        @inject(EditorPreferences)
        protected override readonly editorPreferences: EditorPreferences
    ) {
        super(
            treeWidget,
            formWidget,
            workspaceService,
            logger,
            ExampleTreeEditorWidget.WIDGET_ID,
            options,
            provider,
            nodeFactory,
            editorPreferences
        );
    }

    protected getTypeProperty(): string {
        return 'typeId';
    }

    protected override configureTitle(title: Title<Widget>): void {
        super.configureTitle(title);
        title.iconClass = codicon('list-tree');
    }
}

export namespace ExampleTreeEditorWidget {
    export const WIDGET_ID = 'example-tree-editor-tree-editor';
    export const EDITOR_ID = 'example-tree-editor.tree.editor';
}

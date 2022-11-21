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
import { TreeEditor } from '@eclipse-emfcloud/theia-tree-editor';
import { codicon, LabelProviderContribution } from '@theia/core/lib/browser';
import { injectable } from 'inversify';

import { ExampleTreeEditorWidget } from './example-tree-editor-widget';
import { ExampleTreeModel } from './example-tree-model';

const ICON_CLASSES: Map<string, string> = new Map([
    [ExampleTreeModel.Type.Leaf, codicon('chrome-maximize')],
    [ExampleTreeModel.Type.Tree, codicon('list-tree')],
    [ExampleTreeModel.Type.Node, codicon('type-hierarchy-sub')]
]);

const UNKNOWN_ICON = codicon('question');

@injectable()
export class ExampleTreeLabelProvider implements LabelProviderContribution {
    public canHandle(element: object): number {
        if (
            (
                TreeEditor.Node.is(element) ||
                TreeEditor.CommandIconInfo.is(element)
            ) &&
            element.editorId === ExampleTreeEditorWidget.EDITOR_ID
        ) {
            return 1000;
        }
        return 0;
    }

    public getIcon(element: object): string | undefined {
        let iconClass: string | undefined;

        if (TreeEditor.CommandIconInfo.is(element)) {
            iconClass = ICON_CLASSES.get(element.type);
        } else if (TreeEditor.Node.is(element)) {
            iconClass = ICON_CLASSES.get(element.jsonforms.type);
        }

        return iconClass ?? UNKNOWN_ICON;
    }

    public getName(element: object): string | undefined {
        const data = TreeEditor.Node.is(element)
            ? element.jsonforms.data
            : element;

        if (data.name) {
            return data.name;
        }

        return data.typeId;
    }
}

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
 import '../../src/browser/style/editor.css';
import '@eclipse-emfcloud/theia-tree-editor/style/forms.css';
import '@eclipse-emfcloud/theia-tree-editor/style/index.css';

import { LabelProviderContribution, NavigatableWidgetOptions, OpenHandler, WidgetFactory } from '@theia/core/lib/browser';
import { CommandContribution, MenuContribution } from '@theia/core';
import { createBasicTreeContainer, NavigatableTreeEditorOptions } from '@eclipse-emfcloud/theia-tree-editor';
import URI from '@theia/core/lib/common/uri';
import { ContainerModule } from 'inversify';

import { ExampleTreeLabelProvider } from './tree/example-tree-label-provider';
import { ExampleTreeEditorContribution } from './example-tree-editor-contribution';
import { ExampleTreeLabelProviderContribution } from './example-tree-label-provider-contribution';
import { ExampleTreeEditorWidget } from './tree/example-tree-editor-widget';
import { ExampleTreeNodeFactory } from './tree/example-tree-node-factory';
import { ExampleTreeModelService } from './tree/example-tree-model-service';

export default new ContainerModule(bind => {
    bind(LabelProviderContribution).to(ExampleTreeLabelProviderContribution);

    bind(OpenHandler).to(ExampleTreeEditorContribution);
    bind(MenuContribution).to(ExampleTreeEditorContribution);
    bind(CommandContribution).to(ExampleTreeEditorContribution);

    bind(LabelProviderContribution).to(ExampleTreeLabelProvider);

    bind(ExampleTreeModelService).toSelf().inSingletonScope();
    bind(ExampleTreeLabelProvider).toSelf().inSingletonScope();

    bind<WidgetFactory>(WidgetFactory).toDynamicValue(context => ({
        id: ExampleTreeEditorWidget.WIDGET_ID,
        createWidget: (options: NavigatableWidgetOptions) => {
            const treeContainer = createBasicTreeContainer(
                context.container,
                ExampleTreeEditorWidget,
                ExampleTreeModelService,
                ExampleTreeNodeFactory
            );
            // Bind options
            const uri = new URI(options.uri);
            treeContainer
                .bind(NavigatableTreeEditorOptions)
                .toConstantValue({ uri });
            return treeContainer.get(ExampleTreeEditorWidget);
        }
    }));
});

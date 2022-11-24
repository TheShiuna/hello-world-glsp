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
import { LabelProviderContribution, NavigatableWidgetOptions, OpenHandler, WidgetFactory } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { ContainerModule } from 'inversify';

import { ExampleJsonFormsEditorContribution } from './example-jsonforms-editor-contribution';
import { ExampleJsonFormsEditLabelProviderContribution } from './example-jsonforms-label-provider-contribution';
import { ExampleJsonFormsModelService } from './jsonforms/example-jsonforms-model-service';
import { ExampleJsonFormsWidget, NavigatableExampleJsonFormsOptions } from './jsonforms/example-jsonforms-widget';

export default new ContainerModule(bind => {
    bind(LabelProviderContribution).to(ExampleJsonFormsEditLabelProviderContribution);
    bind(OpenHandler).to(ExampleJsonFormsEditorContribution).inSingletonScope();

    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: ExampleJsonFormsWidget.WIDGET_ID,
        createWidget: (options: NavigatableWidgetOptions) => {
            const child = ctx.container.createChild();

            child.bind(ExampleJsonFormsWidget).toSelf();
            child.bind(ExampleJsonFormsModelService).toSelf();

            const uri = new URI(options.uri);
            child.bind(NavigatableExampleJsonFormsOptions)
                .toConstantValue({ uri });

            return child.get(ExampleJsonFormsWidget);
        }
    }));
});

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
import { ContainerModule } from '@theia/core/shared/inversify';
import { ExampleWidget } from './example-widget';
import { ExampleWidgetContribution } from './example-widget-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

export default new ContainerModule(bind => {

    // Liste de bind à rajouter pour injecter la vue de mon Widget + Widget
    bindViewContribution(bind, ExampleWidgetContribution);
    bind(FrontendApplicationContribution).toService(ExampleWidgetContribution);
    bind(ExampleWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: ExampleWidget.ID,
        createWidget: () => ctx.container.get<ExampleWidget>(ExampleWidget)
    })).inSingletonScope();
});

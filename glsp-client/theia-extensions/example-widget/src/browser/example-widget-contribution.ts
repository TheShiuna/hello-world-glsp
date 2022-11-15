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
import { injectable } from '@theia/core/shared/inversify';
import { MenuModelRegistry } from '@theia/core';
import { ExampleWidget } from './example-widget';
import { AbstractViewContribution } from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';

export const ExampleWidgetCommand: Command = { id: 'example-widget:command' };

@injectable()
// Add contribution interface to be implemented, e.g. "EmptyContribution implements CommandContribution"
export class ExampleWidgetContribution extends AbstractViewContribution<ExampleWidget> {

    constructor() {
        super({
            widgetId: ExampleWidget.ID,
            widgetName: ExampleWidget.LABEL,
            defaultWidgetOptions: {
                area: 'left'
            },
            toggleCommandId: ExampleWidgetCommand.id
        });
    }

    // Ouvre la vue vers notre ExampleWidget via la commande registerCommand
    override registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(ExampleWidgetCommand, {
            execute: () => super.openView({ activate: false, reveal: true })
        });
    }

    override registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}

export const WidgetCommand: Command = { id: 'widget:command' };

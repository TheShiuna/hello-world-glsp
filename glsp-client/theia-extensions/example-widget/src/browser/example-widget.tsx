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
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';

@injectable()
export class ExampleWidget extends ReactWidget {
    static readonly ID = 'example:widget';
    static readonly LABEL = 'Example Widget';

    @postConstruct()
    protected async init(): Promise<void> {
        this.id = ExampleWidget.ID;
        this.title.label = ExampleWidget.LABEL;
        this.title.caption = ExampleWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-windows-maximize';
        this.update();
    }

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    protected displayMessage(): void {
        this.messageService.info(
            'Bravo, j\'ai réalisé l\'affichage de du message de service de mon widget d\'exemple',
            { timeout: 3000 }
        );
    }

    protected render(): React.ReactElement {
        const header = `Premier exemple de widget 
        qui va appeler (comme montré dans la documentation Theia) le service messageService
        pour affiche une modale informative à l'utilisateur final de l'IDE`;
        return (
            <div id='widget-container'>
                <AlertMessage
                    type='INFO'
                    header={header}
                />
                <button
                    className='theia-button primary'
                    title='Afficher le message de service'
                    onClick={ _e => this.displayMessage()}
                >
                    Afficher le message
                </button>
            </div>
        );
    }
}

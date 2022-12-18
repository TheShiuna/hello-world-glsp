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
import { CommandContribution, MenuContribution } from '@theia/core';
import { KeybindingContribution, LabelProvider, OpenHandler, WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { ContainerModule, interfaces } from '@theia/core/shared/inversify';

import { PokemonApiEditorBackendService, POKEMON_API_EDITOR_BACKEND_PATH } from '../common/pokemon-api-editor-protocol';
import {
    PokemonApiEditorCommandContribution,
    PokemonApiEditorKeybindingContribution,
    PokemonApiEditorMenuContribution
} from './pokemon-api-editor-commands';
import { PokemonApiEditorContribution } from './pokemon-api-editor-contribution';
import { PokemonApiEditorDialog, PokemonApiEditorDialogFactory, PokemonApiEditorDialogProps } from './pokemon-api-editor-dialog';

export default new ContainerModule(bind => {
    bind(CommandContribution).to(PokemonApiEditorCommandContribution);
    bind(KeybindingContribution).to(PokemonApiEditorKeybindingContribution);
    bind(MenuContribution).to(PokemonApiEditorMenuContribution);

    bind(PokemonApiEditorDialogFactory).toFactory(ctx =>
        (props: PokemonApiEditorDialogProps, labelProvider: LabelProvider) =>
            createNewFilePokemonDialogContainer(ctx.container, props, labelProvider).get(PokemonApiEditorDialog)
    );

    bind(OpenHandler).to(PokemonApiEditorContribution).inSingletonScope();

    bind(PokemonApiEditorBackendService).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        return connection.createProxy<PokemonApiEditorBackendService>(POKEMON_API_EDITOR_BACKEND_PATH);
    }).inSingletonScope();
});

const createNewFilePokemonDialogContainer = (
    container: interfaces.Container,
    props: PokemonApiEditorDialogProps,
    labelProvider: LabelProvider
): interfaces.Container => {
    const child = container.createChild();

    child.bind(PokemonApiEditorDialogProps).toConstantValue(props);
    child.bind(LabelProvider).toConstantValue(labelProvider);
    child.bind(PokemonApiEditorDialog).toSelf();

    return child;
};

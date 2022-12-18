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
import { injectable } from 'inversify';
import { NavigatableWidgetOpenHandler, WidgetOpenerOptions } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';

import { PokemonApiEditorWidget } from './pokemon-editor/pokemon-api-editor-widget';

@injectable()
export class PokemonApiEditorContribution extends NavigatableWidgetOpenHandler<PokemonApiEditorWidget> {
    readonly id: string = PokemonApiEditorWidget.WIDGET_ID;
    readonly label = PokemonApiEditorWidget.LABEL;

    canHandle(uri: URI, options?: WidgetOpenerOptions): number {
        return uri.path.ext === '.pokemon'
            ? 1000
            : 0;
    }
}

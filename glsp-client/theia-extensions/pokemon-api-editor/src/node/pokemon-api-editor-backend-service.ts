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
import { Pokemon, PokemonApiEditorBackendService, PokemonApiResult } from '../common/pokemon-api-editor-protocol';

interface PokemonUrlListRaw {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<{
        name: string;
        url: string;
    }>
}

interface PokemonRaw {
    id: number;
    name: string;
    types: Array<{
        slot: number;
        type: {
            name: string;
            url: string;
        };
    }>;
    sprites: {
        front_default: string;
    };
}

@injectable()
export class PokemonApiEditorBackendServiceImpl implements PokemonApiEditorBackendService {
    static readonly POKEMON_API_URL = 'https://pokeapi.co/api/v2';
    static readonly DEFAULT_LIMIT = 10;

    async getPokemon(offset?: number, limit?: number): Promise<PokemonApiResult> {
        const offsetPokemon = offset ?? 0;
        const limitPokemon = limit ?? PokemonApiEditorBackendServiceImpl.DEFAULT_LIMIT;

        const pokemonListRaw: PokemonUrlListRaw = await fetch(
            `${PokemonApiEditorBackendServiceImpl.POKEMON_API_URL}?offset${offsetPokemon}=&limit=${limitPokemon}`
        ).then(res => res.json());
        const pokemonRawArray: PokemonRaw[] = await Promise.all(
            pokemonListRaw.results.map(({ url }) => fetch(url).then(res => res.json()))
        );

        return {
            count: pokemonListRaw.count,
            results: pokemonRawArray.map(rawPokemon => this.formatPokemon(rawPokemon))
        };
    }

    protected formatPokemon(rawPokemon: PokemonRaw): Pokemon {
        return {
            id: rawPokemon.id,
            name: rawPokemon.name,
            type: rawPokemon.types.map(type => type.type.name),
            visual: rawPokemon.sprites.front_default
        };
    }
}

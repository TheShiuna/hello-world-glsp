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
/* eslint-disable no-null/no-null */
type Nationality =
    | 'AUT'
    | 'FRA'
    | 'GBR'
    | 'GER'
    | 'ITA'
    | 'LUX'
    | 'NOR'
    | 'SRB';

export interface Person {
    personalId: number;
    firstName: string;
    lastName: string;
    registered: boolean;
    birthDate: string;
    nationality?: Nationality;
    email: string[];
}

export namespace Person {
    export function is(object: any): object is Person {
        return typeof object === 'object' && (
            'personalId' in object && typeof object['personalId'] === 'number' &&
            'firstName' in object && typeof object['firstName'] === 'string' &&
            'lastName' in object && typeof object['lastName'] === 'string' &&
            'registered' in object && typeof object['registered'] === 'boolean' &&
            'birthDate' in object && typeof object['birthDate'] === 'string' &&
            (typeof object['nationality'] === 'undefined' || ('nationality' in object && typeof object['nationality'] === 'string')) &&
            'email' in object && Array.isArray(object['email']));
    }
}

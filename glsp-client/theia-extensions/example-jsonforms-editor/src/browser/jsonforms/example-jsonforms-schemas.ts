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
export const exampleTypeSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'poeple',
    title: "JSON type schema for 'poeple'",
    type: 'object',
    definitions: {
        poeple: {
            $id: '#person',
            title: 'Person',
            type: 'object',
            properties: {
                firstName: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 30
                },
                lastName: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 30
                },
                registered: {
                    type: 'boolean'
                },
                birthDate: {
                    type: 'string',
                    format: 'date'
                },
                personalId: {
                    type: 'integer',
                    minimum: 100,
                    maximum: 5000
                },
                nationality: {
                    type: 'string',
                    enum: [
                        'AUT',
                        'FRA',
                        'GBR',
                        'GER',
                        'ITA',
                        'LUX',
                        'NOR',
                        'SRB'
                    ]
                },
                email: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'email'
                    }
                }
            }
        }
    }
};

export const exampleUiSchema = {
    type: 'VerticalLayout',
    elements: [
        {
            type: 'Label',
            text: 'Personal details'
        },
        {
            type: 'HorizontalLayout',
            elements: [
                {
                    type: 'Control',
                    scope: '#/properties/firstName'
                },
                {
                    type: 'Control',
                    scope: '#/properties/lastName'
                }
            ]
        },
        {
            type: 'Control',
            scope: '#/properties/registered'
        },
        {
            type: 'Control',
            scope: '#/properties/birthDate'
        },
        {
            type: 'Control',
            scope: '#/properties/personalId'
        },
        {
            type: 'Control',
            scope: '#/properties/nationality'
        },
        {
            type: 'Control',
            scope: '#/properties/email'
        }
    ]
};

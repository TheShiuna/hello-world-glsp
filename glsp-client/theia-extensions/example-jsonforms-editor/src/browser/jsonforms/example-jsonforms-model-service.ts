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
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { injectable } from 'inversify';

import { exampleTypeSchema, exampleUiSchema } from './example-jsonforms-schemas';
import { Person } from './example-jsonforms-model';

@injectable()
export class ExampleJsonFormsModelService {
    readonly id = ExampleJsonFormsModelService.ID;
    readonly label = ExampleJsonFormsModelService.LABEL;

    // store the model source
    protected dataModel: Person;

    get data(): Person {
        return this.dataModel;
    }

    getDefaultData(): Person {
        return {
            personalId: -1,
            firstName: '',
            lastName: '',
            registered: false,
            birthDate: '',
            email: []
        };
    }

    setData(newData: Partial<Person>): void {
        if (!this.dataModel) {
            this.dataModel = Person.is(newData) ? newData : this.getDefaultData();
        } else {
            this.dataModel = newData as Person;
        }
    }

    getSchema(): Promise<JsonSchema> {
        return Promise.resolve({
            definitions: exampleTypeSchema.definitions,
            ...exampleTypeSchema.definitions.poeple
        });
    }

    getUiSchema(): Promise<UISchemaElement> {
        return Promise.resolve(exampleUiSchema);
    }
}

export namespace ExampleJsonFormsModelService {
    export const ID = 'example-jsonforms-resources';
    export const LABEL = 'Example Json forms editor';
}

import { Injectable } from '@nestjs/common';
import { title } from 'process';

@Injectable()
export class UbungService {
    findAll() {
        return [
            { id: 1, title: 'SELECT Basics', beschreibung: 'Beschreibung der Übung 1' },
            { id: 2, title: 'JOIN Operations', beschreibung: 'Beschreibung der Übung 2' },
            { id: 3, title: 'GROUP BY and Aggregations', beschreibung: 'Beschreibung der Übung 3' },
        ];
    }
}

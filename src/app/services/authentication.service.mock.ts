import { Injectable } from '@angular/core';

import { User } from '../api/models/index';
import { UserAPIService } from '../api/pouchdb-service/user-api.service';
import { isNullOrUndefined } from 'util';

@Injectable()
export class AuthenticationServiceMock {

    private currentUser: User;

    users = [
        {
            '_id': 'id1',
            'username': 'username1',
            'password': 'password1',
            'name': 'name1',
            'surname': 'surname1',
            'email': 'email1',
            'phoneNr': 'phoneNr1'
        },
        {
            '_id': 'id2',
            'username': 'username2',
            'password': 'password2',
            'name': 'name2',
            'surname': 'surname2',
            'email': 'email2',
            'phoneNr': 'phoneNr2'
        }
    ];

    constructor(private UserAPIService: UserAPIService) { }

    login(username: string, password: string): Promise<boolean> {

        const myUser = this.users.filter((user: User) => {
            return user.username === username && user.password === password;
        });

        return Promise.resolve(!isNullOrUndefined(myUser));
    }

    logout(): void {
        this.currentUser = null;
    }

    isSessionValid(): boolean {
        return !isNullOrUndefined(this.currentUser);
    }
}

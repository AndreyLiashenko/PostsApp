import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Post, FBCreatedResponse} from './interfaces';
import { environment } from 'src/environments/environment';
import {map} from 'rxjs/operators'

@Injectable({providedIn: 'root'})
export class PostsService{

    constructor(private httpClient: HttpClient) {}

    create(post: Post): Observable<Post>{
        return this.httpClient.post(`${environment.fbDbUrl}posts.json`, post)
        .pipe(map( (response: FBCreatedResponse) => {
            return {
                ...post,
                id: response.name,
                date: new Date(post.date)
            }
        }))
    }

    getAll() : Observable<Post[]>{
        return this.httpClient.get(`${environment.fbDbUrl}posts.json`)
            .pipe(map((response: {[key: string] : any}) => {

                return Object.keys(response)
                .map(key => ({
                    ...response[key],
                    id: key,
                    date: new Date(response[key].date)
                }));
            }))
    }

    getById(id: string) : Observable<Post> {
        return this.httpClient.get<Post>(`${environment.fbDbUrl}posts/${id}.json`)
        .pipe(map( (post: Post) => {
            return {
                ...post,
                id,
                date: new Date(post.date)
            }
        }))
    }

    update(post: Post) : Observable<Post>{
        return this.httpClient.patch<Post>(`${environment.fbDbUrl}posts/${post.id}.json`, post);
    }
    remove(id: string) : Observable<void> {
        return this.httpClient.delete<void>(`${environment.fbDbUrl}posts/${id}.json`)
    }
}
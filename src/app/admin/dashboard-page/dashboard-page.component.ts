import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../../shared/posts.service';
import {Post} from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  postSubscription: Subscription;
  deletePostSubscription: Subscription;
  searchStr = '';

  constructor(private postsService: PostsService, private alertService: AlertService) { }

  ngOnInit() {
    this.postSubscription = this.postsService.getAll().subscribe( posts => {
        this.posts = posts;
    })
  }

  remove(id: string){
    this.deletePostSubscription = this.postsService.remove(id).subscribe(() => 
    {
      this.posts = this.posts.filter(post => post.id !== id);
      this.alertService.warning('Пост был удален');
    })
  }

  ngOnDestroy(){
    if(this.postSubscription){
      this.postSubscription.unsubscribe();
    }

    if(this.deletePostSubscription){
      this.deletePostSubscription.unsubscribe();
    }
  }

}

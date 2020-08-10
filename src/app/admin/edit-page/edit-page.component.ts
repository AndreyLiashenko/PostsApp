import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostsService } from 'src/app/shared/posts.service';
import { switchMap } from 'rxjs/operators';
import {Post} from '../../shared/interfaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { from, Subscribable, Subscription } from 'rxjs';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  post: Post;
  submitted: boolean = false;
  updateSubscription: Subscription;

  constructor(private route: ActivatedRoute, private postService: PostsService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postService.getById(params['id']);
      }))
      .subscribe((post: Post) => {
        this.post = post;
        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required)
        })
      })
  }

  submit(){
    if(this.form.invalid){
      return;
    }

    this.submitted = true;

    this.updateSubscription = this.postService.update({
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title,
    })
    .subscribe(() => {
      this.submitted = false;
      this.alertService.success('Пост был обновлен');
    })
  }

  ngOnDestroy(){
    if(this.updateSubscription){
      this.updateSubscription.unsubscribe();
    }
  }
}

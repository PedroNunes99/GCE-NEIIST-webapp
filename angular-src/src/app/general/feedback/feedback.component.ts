import { Component, OnInit, TemplateRef  } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {FeedbackService} from '../../services/feedback.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  public name:string;
  public email:string;
  public message:string;
  public entity:string;

  constructor(private validateService: ValidateService,
              private flashMessage: FlashMessagesService,
              private feedbackService: FeedbackService,
              private modalService: NgbModal) { }

  ngOnInit() {
  }

  //TODO - add an auth interceptor, instead of having a message in the front-end.

  clearFeedbackForm() {
    this.name = null;
    this.email = null;
    this.message = null;
  }

    public openModal(content) {
        this.modalService.open(content);

    }
  sendFeedback() {

    const feedback = {
      name: this.name,
      email: this.email,
      message: this.message
    };

    if (!this.validateService.validateFeedback(feedback))  {
      this.flashMessage.show("Por favor introduz todas as informações necessárias", {cssClass: 'alert-danger', timeout: 2500});
      return false;
    }

      if (!this.validateService.validateTeamContact(this.email))  {
          this.flashMessage.show('Por favor introduz um e-mail válido.', {cssClass: 'alert-danger', timeout: 1500});
          return false;
      }

    this.feedbackService.sendFeedback(feedback).subscribe(data => {
      if (data.succeeded) {
        this.clearFeedbackForm();
        this.flashMessage.show("Feedback enviado com sucesso", {cssClass: 'alert-success', timeout: 3000});
        setTimeout( () =>  {
        }, 1000);
      } else {
        this.flashMessage.show("Feedback não enviado. Contacte a administração", {cssClass: 'alert-danger', timeout: 3000});

      }
    });


  }
}

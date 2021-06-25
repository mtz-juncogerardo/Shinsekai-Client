import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {LoaderService} from '../../services/loader.service';
import {AlertService} from '../../services/alert.service';
import {IQuestion} from '../../core/Interfaces/IQuestion';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  questions: IQuestion[];
  form: FormGroup;
  selectedQuestion: IQuestion;
  editFlag: boolean;

  constructor(private crud: CrudService,
              private formBuilder: FormBuilder,
              private loader: LoaderService,
              private alert: AlertService) {
    this.questions = [];
    this.selectedQuestion = {};
    this.editFlag = false;
    this.form = this.formBuilder.group({
      id: [null],
      question: [null, Validators.required],
      answer: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loader.beginLoad();
    this.crud.setEndpoint('admin/questions/read');
    this.getQuestions();
  }

  private getQuestions(): void {
    this.crud.httpGet().toPromise()
      .then(res => this.questions = res.response)
      .finally(() => this.loader.endLoad());
  }

  cleanForms(): void {
    this.form.reset();
    this.editFlag = false;
  }

  update(question: IQuestion): void {
    this.editFlag = true;

    this.form.patchValue({
      id: question?.id,
      question: question?.question,
      answer: question?.answer
    });
  }

  setQuestion(question: IQuestion): void {
    this.selectedQuestion = question;
  }

  delete(): void {
    this.loader.beginLoad();
    this.crud.setEndpoint('admin/questions');
    this.crud.httpDelete(`?id=${this.selectedQuestion.id}`).toPromise()
      .then(res => {
        if (res.response) {
          this.questions = this.questions.filter(q => q.id !== this.selectedQuestion.id);
          this.alert.pushAlert({type: 'success', message: 'La pregunta se elimino con exito'});
        }
      })
      .finally(() => this.loader.endLoad());
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loader.beginLoad();

    if (this.editFlag) {
      this.crud.setEndpoint('admin/questions/update');
      this.crud.httpPut(this.form.value).toPromise()
        .then(res => {
          if (res.response) {
            this.questions = this.questions.map(q => q.id === res.response.id ? res.response : q);
            this.alert.pushAlert({type: 'success', message: 'La pregunta se actualizo con exito'});
            this.cleanForms();
          }
        })
        .finally(() => this.loader.endLoad());

      return;
    }

    this.crud.setEndpoint('admin/questions/create');
    this.crud.httpPost(this.form.value).toPromise()
      .then(res => {
        if (res.response) {
          this.questions.unshift(res.response);
          this.alert.pushAlert({type: 'success', message: 'La pregunta se creo con exito'});
          this.cleanForms();
        }
      })
      .finally(() => this.loader.endLoad());
  }
}

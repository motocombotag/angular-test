import { Component, OnInit } from '@angular/core';
import axios, { AxiosResponse, AxiosError } from 'axios';

interface ICommit {
  authorName: string;
  authorEmail: string;
  date: string;
  message: string;
  hash: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public commits: ICommit[];

  constructor() {}

  ngOnInit(): void {
    this.fetchCommits();
  }

  private processCommits(data: any[]): ICommit[] {
    const result: ICommit[] = data.map((s) => ({
      authorName: s.commit.author.name,
      authorEmail: s.commit.author.email,
      date: s.commit.author.date,
      message: s.commit.message,
      hash: s.sha,
    }));

    return result;
  }

  private fetchCommits(): void {
    const onDone = (response: AxiosResponse): void => {
      this.commits = this.processCommits(response.data.slice(0, 10));
    };

    const onError = (err: AxiosError): void => {
      console.log('[err]', err);
    };

    const url = 'https://api.github.com/repos/facebook/draft-js/commits';
    const headers = {
      Accept: 'application/vnd.github.v3+json',
    };

    axios
      .get(url, { headers })
      .then(onDone)
      .catch(onError);
  }
}

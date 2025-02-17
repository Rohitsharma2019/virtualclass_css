class QuestionAnswer {
  elapsedComponentTime(data) {
    const currentEditTime = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
    const previousTime = ((data.componentId).split(`${data.component}-${virtualclass.gObj.orginalUserId}-`))[1];
    return Math.floor((currentEditTime - (+previousTime)) / 60);
  }

  separatedContent(data) {
    let content;
    let moreContent;
    if (data.content.length > 128) {
      content = data.content.slice(0, 128);
      moreContent = data.content.slice(128, data.content.length);
    } else {
      content = data.content;
    }
    if (data.action === 'edit' || data.action === 'cancel') {
      const getContentElem = document.querySelector(`#${data.componentId} .content p`);
      const ellipsisTemp = virtualclass.getTemplate('ellipsisText', 'askQuestion');
      if (getContentElem) {
        getContentElem.innerHTML = content;
      }
      if (data.content.length > 128) {
        const ellipsisTextTemp = ellipsisTemp({ morecontent: moreContent }); // TODO use this template in question, answer, comment
        document.querySelector(`#${data.componentId} .content p`).insertAdjacentHTML('beforeend', ellipsisTextTemp);
      }
      this.displayMore(data);
    } else if (data.action === 'create') {
      return { content, moreContent };
    }
  }

  displayMore(data) {
    const componentId = (data.action === 'create') ? data.id : data.componentId;
    const btn = document.querySelector(`#${componentId} .content p .btn`);
    if (data.content.length > 128 && btn) {
      if (btn.classList.contains('close')) {
        btn.classList.remove('close');
        btn.classList.add('open');
      }
    }
  }

  addHighLight(data) { //  question part
    if (data.component === 'question' && (data.action === 'create' || data.action === 'edit')
      && (virtualclass.userInteractivity.getActiveTab() !== 'question')
    ) {
      this.addHighLightNewActual();
    }
  }

  addHighLightNewActual() {  //  question part
    document.getElementById('congAskQuestion').classList.add('highlight-new-question');
  }

  removeHighlight() {  //  question part
    const element = document.getElementById('congAskQuestion');
    if (element.classList.contains('highlight-new-question')) {
      element.classList.remove('highlight-new-question');
    }
  }

  viewAllQuestion(ev) { // Question part
    this.triggerPause();
    const viewAllQuestion = document.getElementById('viewAllQuestion');
    const viewAllAction = ev.currentTarget.dataset.viewall;
    const askQuestion = document.getElementById('askQuestion');
    if (askQuestion != null) {
      const rightPanel = document.getElementById('virtualclassAppRightPanel');
      const currentContext = document.querySelector('#askQuestion .container .current');
      if (currentContext) { currentContext.classList.remove('current'); }

      if (viewAllAction === 'enable') {
        if (rightPanel) { rightPanel.classList.add('viewAllMode'); }
        askQuestion.classList.add('viewAll');
        viewAllQuestion.dataset.viewall = 'disable';
        if (!this.viewAllTriggered) {
          for (const context in virtualclass.userInteractivity.queue.question) {
            if (!this.context[context]) {
              this.context[context] = new QAcontext();
            }
            this.triggerPerform(context);
          }
        }
        this.viewAllTriggered = true;
        this.viewAllMode = true;
      } else {
        virtualclass.userInteractivity.currentContext = virtualclass.userInteractivity.readyContextActual();
        if (rightPanel) { rightPanel.classList.remove('viewAllMode'); }
        askQuestion.classList.remove('viewAll');
        viewAllQuestion.dataset.viewall = 'enable';
        const currentContextElement = document.querySelector(`#askQuestion .context[data-context~=${virtualclass.userInteractivity.currentContext}]`);
        if (currentContextElement) currentContextElement.classList.add('current');
        this.viewAllMode = false;
      }
    }
  }
}

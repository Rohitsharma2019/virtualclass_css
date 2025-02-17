class UserInteractivityRenderer { // Main Part
  mainInterface(data) { // Main Part
    if (data && data.component === 'note') {
      // this.qaNote.renderMainContainer();
    } else {
      // TODO, this code needs to be simplified
      // const toggle = document.querySelector('#virtualclassCont.congrea #congHr');
      const toggle = document.querySelector('#virtualclassCont.congrea #congAskQuestion');
      const context = {};
      const qaTemp = virtualclass.getTemplate('askQuestionMain', 'askQuestion');
      const qtemp = qaTemp(context);
      document.querySelector('#rightSubContainer').insertAdjacentHTML('beforeend', qtemp);
      if (!virtualclass.vutil.checkUserRole()) {
        virtualclass.settings.qaAnswer(virtualclass.settings.info.qaAnswer);
        virtualclass.settings.qaComment(virtualclass.settings.info.qaComment);
        virtualclass.settings.qaUpvote(virtualclass.settings.info.qaUpvote);
        virtualclass.settings.askQuestion(virtualclass.settings.info.askQuestion);
        virtualclass.settings.qaMarkNotes(virtualclass.settings.info.qaMarkNotes);
      }

      toggle.addEventListener('click', (elem) => {
        virtualclass.userInteractivity.initFirebaseOperatoin();
        virtualclass.userInteractivity.renderMainContainer(elem.currentTarget);
        // if (toggle.classList.contains('highlight-new-question')) {
        //   toggle.classList.remove('highlight-new-question');
        // }
        virtualclass.userInteractivity.questionAnswer.removeHighlight();
        this.reArrangeUpvoteCallback = () => {
          console.log('====> one');
          if (!virtualclass.userInteractivity.rearrangeUpvoteDone) {
            virtualclass.userInteractivity.triggerRearrangeUpvotedElem({ context: virtualclass.userInteractivity.currentContext, component: 'question' });
            virtualclass.userInteractivity.triggerRearrangeUpvotedElem({ context: virtualclass.userInteractivity.currentContext, component: 'answer' });
          }
        }
        this.reArrangeUpvoteCallback();
      });

      const addQuestion = document.querySelector('#virtualclassCont.congrea .addQuestion-icon');
      if (addQuestion) {
        addQuestion.addEventListener('click', () => {
          let writeContent = document.getElementById('writeContent');
          if (writeContent) {
            writeContent.childNodes[1].childNodes[0].click();
            writeContent = null;
          }
          if (!writeContent) {
            virtualclass.userInteractivity.engine.performWithQueue({ component: 'question', action: 'renderer', type: 'input', context: virtualclass.userInteractivity.currentContext });
          }
        });
      }

      const note = document.getElementById('virtualclassnote');
      note.addEventListener('click', (event) => {
        // this.handler.bind(this)
        virtualclass.userInteractivity.triggerInitFirebaseOperation('note');
        virtualclass.rightbar.handleDisplayBottomRightBar(event.currentTarget);
        virtualclass.userInteractivity.engine.performWithQueue({ component: 'note', action: 'renderer', type: 'noteContainer', context: virtualclass.userInteractivity.currentContext });
        const positionNote = virtualclass.userInteractivity.note.queue.indexOf(virtualclass.userInteractivity.currentContext).indexOf;
        if (positionNote >= 0) {
          virtualclass.userInteractivity.note.current = virtualclass.userInteractivity.note.queue.indexOf(virtualclass.userInteractivity.currentContext);
        }
        virtualclass.userInteractivity.note.updateNavigateNumbers(virtualclass.userInteractivity.currentContext);
      });
    }
  }

  input(data) { // Main Part
    console.log('=== input handle ', data.component);
    let insertId;
    if (data.component === 'question') {
      insertId = '#askQuestion';
    } else {
      insertId = '#' + ((data.componentId === null) ? data.parent : data.componentId);
    }

    let text = document.querySelector('#writeContent .text');
    // if (text) { return; }

    const context = { componentId: data.componentId, component: data.component, parent: data.parent };
    const userInput = virtualclass.getTemplate(data.type, 'askQuestion');
    const userInputTemplate = userInput(context);
    if (typeof data.content !== 'undefined' && typeof data.componentId !== 'undefined') {
      if (data.userId === virtualclass.gObj.orginalUserId) {
        document.querySelector(`#${data.componentId} .content p`).innerHTML = '';
        document.querySelector(`#${data.componentId} .content p`).insertAdjacentHTML('beforeend', userInputTemplate);
        text = document.querySelector('#writeContent .text');
        if (text) {
          text.innerHTML = data.content;
          this.autosize({target: text});
        }
      }
    } else {
      if (data.component === 'question') {
        document.querySelector(insertId).insertAdjacentHTML('beforeend', userInputTemplate);
      } else {
        document.querySelector(`${insertId} .${data.component}s`).insertAdjacentHTML('beforebegin', userInputTemplate);
        const bounding = document.querySelector(`#${data.parent}`).getBoundingClientRect();
        if (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
          && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
          // console.log('In the viewport!'); TODO
          // askQuestion.classList.remove('tempDown');
        } else {
          document.querySelector(`#${data.parent}`).scrollIntoView();
        }
      }
    }

    const inputAction = document.querySelector('#writeContent');
    if (data.component === 'question') {
      if (inputAction) {
        if (inputAction.parentNode.id === 'askQuestion') {
          inputAction.addEventListener('click', virtualclass.userInteractivity.handler.bind(virtualclass.userInteractivity));
        }
      }
    }
    inputAction.addEventListener('input', virtualclass.userInteractivity.userInputHandler.bind(this, data.component));
    const textArea = document.querySelector('#writeContent .text')
    // textArea.addEventListener('focus', virtualclass.vutil.inputFocusHandler);
    // textArea.addEventListener('focusout', virtualclass.vutil.inputFocusOutHandler);
  }

  contentBox(data) { // Main Part
    const text = virtualclass.userInteractivity.questionAnswer.separatedContent(data);
    if (data.component === 'question') {
      const chkContextElem = document.querySelector(`#askQuestion .context[data-context~=${data.context}]`);
      if ('question' && chkContextElem) {
        const componentTemplate = virtualclass.getTemplate(data.component, 'askQuestion');
        const htmlContent = componentTemplate({ id: data.id, userName: data.uname, content: text.content, morecontent: text.moreContent });
        document.querySelector(`#askQuestion [data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', htmlContent);
      } else {
        const getContextTemp = virtualclass.getTemplate('context', 'askQuestion');
        const cTemp = getContextTemp({ context: data.context });
        document.querySelector('#askQuestion .container').insertAdjacentHTML('beforeend', cTemp);
        const componentTemp = virtualclass.getTemplate(data.component, 'askQuestion');
        document.querySelector(`#askQuestion [data-context~=${data.context}] .container`).insertAdjacentHTML('beforeend', componentTemp({
          id: data.id,
          userName: data.uname,
          content: text.content,
          morecontent: text.moreContent,
        }));
        console.log('====> adding current ');
        document.querySelector(`#askQuestion [data-context~=${data.context}]`).classList.add('current');

      }
    } else if (data.component === 'answer' || data.component === 'comment') {
      const qaAnswerTemp = virtualclass.getTemplate(data.component, 'askQuestion');
      const context = {
        id: data.id,
        itemId: data.componentId,
        userName: data.uname,
        hasControl: virtualclass.vutil.checkUserRole(),
        content: text.content,
        morecontent: text.moreContent,
        parent: data.parent,
      };
      const ansTemp = qaAnswerTemp(context);
      if (data.component === 'answer') {
        document.querySelector(`#${data.parent} .answers`).insertAdjacentHTML('beforeend', ansTemp);
        virtualclass.userInteractivity.navigationHandler(data, 'removeNavigation');
      } else if (data.component === 'comment') {
        const comment = document.querySelector(`#${data.parent} .comments`);
        if (comment) { comment.insertAdjacentHTML('beforeend', ansTemp); };
        // document.querySelector(`#${data.parent} .comments`).insertAdjacentHTML('beforeend', ansTemp);
      }
    }
    virtualclass.userInteractivity.questionAnswer.displayMore(data);
    document.querySelector(`#${data.componentId}`).scrollIntoView();
    if (+(data.userId) === +(virtualclass.gObj.orginalUserId)) {
      if (data.component === 'note') {
        this.renderNote(data.context);
        const textArea = document.querySelector(`#noteContainer .context[data-context="${data.context}"] textarea.content`);
        textArea.value = data.content;
      } else if (data.component !== 'comment') {
        document.querySelector(`#${data.id} .upVote`).dataset.upvote = 'upvoted';
      }
      // if (!virtualclass.vutil.checkUserRole()) {
      const currentElem = document.querySelector(`#${data.componentId}`);
      if (currentElem) {
        currentElem.classList.add('mySelf');
        const time = virtualclass.userInteractivity.questionAnswer.elapsedComponentTime({ componentId: data.componentId, component: data.component });
        if (time < 30 && !virtualclass.vutil.checkUserRole()) {
          currentElem.classList.add('editable');
        } else if (virtualclass.vutil.checkUserRole()) {
          currentElem.classList.add('editable');
        }
      }
      // }
    }
    if (data.component === 'question') {
      const qnElem = document.querySelector(`#${data.id}.question`);
      if (qnElem) {
        qnElem.addEventListener('click', (ev) => {
          virtualclass.userInteractivity.handler(ev);
        });
      }
    }
    // if (data.component === 'question' || data.component === 'answer') {
    //   virtualclass.userInteractivity.triggerRearrangeUpvotedElem(data);
    // }
  }
  autosize(ev) { // main part
    setTimeout(() => {
      ev.target.style.cssText = 'height:auto; padding:0';
      ev.target.style.cssText = 'height:' + ev.target.scrollHeight + 'px';
    }, 1000);
  }

  noteContainer(data) {
    virtualclass.userInteractivity.note.container(data);
  }

  noteWithContent(data) {
    virtualclass.userInteractivity.note.displayWithContent(data);
  }

  bookmark(data) { // book mark
    virtualclass.userInteractivity.bookmark.updateOnPageRefresh(data);
  }

  removeWriteContainer() { // main part
    const text = document.querySelector('#writeContent');
    if (text) {
      text.remove();
    }
  }
}

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./projects/pulse-cli/src/lib/command-line.component/command-line.component.html":
/*!*****************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./projects/pulse-cli/src/lib/command-line.component/command-line.component.html ***!
  \*****************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Generated template for the CommandLineComponent component -->\n<div class=\"backgroundOverlay\">\n\n</div>\n\n<div id=\"speechBubbleContainer\" #speechBubbleContainer >\n  <div id=\"speechBubbleContent\" #speechBubbleContent>\n    <!-- Welcome to the command line interface. Type <span class=\"command\">?</span> for a list of available commands. -->\n  </div>\n  <div class=\"speech-bubble-base\"></div>\n</div>\n\n\n\n<pre id=\"divArea\"  #divArea contenteditable  (keypress)=\"keypress($event)\" (keydown)=\"keydown($event)\" tabindex=\"-1\">{{command}}</pre>\n<!-- <div #belowDivArea style=\"position:relative\" (click)=\"setFocusToCommandLine\" (suggestionSelected)=\"suggestionSelected($event)\">\n  <suggestion-box #suggestionBox style=\"font-family:monospace\" style=\"display:none\"></suggestion-box>\n</div> -->\n\n\n\n\n\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./projects/pulse-cli/src/lib/command-output.component/command-output.component.html":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./projects/pulse-cli/src/lib/command-output.component/command-output.component.html ***!
  \*********************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"outerContainer\">\n    <div class=\"outputHeader\" (mousedown)=\"outputHeaderMouseDown($event)\" (mouseup)=\"outputHeaderMouseUp()\">\n        <div (click)=\"outputHeaderClicked()\" class=\"commandString mat-small\">{{commandString}}</div>\n        <div (click)=\"destroyCommandOutput($event)\">\n            <span class=\"close-button\" name=\"close-circle\"><img src=\"/assets/close-icon.svg\"> </span>\n        </div>\n    </div>\n    <div class=\"contentContainer\" style=\"height:100%\">\n        <div (commandIssued)=\"commandIssued($event)\" (updateCommandString)=\"updateCommandString($event.detail.commandString)\" style=\"height:100%\">\n            <!-- <command-line #commandline command=\"{{command}}\"></command-line> -->\n            <div #container class=\"output\" (update)=\"detectChanges()\" [innerHTML]=\"myHTML | safeHtml\"></div>\n        </div>\n    </div>\n</div>\n\n\n\n\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.component.html":
/*!***********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.component.html ***!
  \***********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n<div id=\"pageContainer-across\" (mouseover)=\"mouseover($event)\" (keydown)=\"keydown($event)\" (keyup)=\"keyup($event)\" (mouseup)=\"splitContainerMouseUp($event)\"\n  tabindex=\"0\">\n\n  <div id=\"topBar-vertical\">\n\n\n    <div  class=\"button-container\">\n      <button  (click)='commandRegistry.parseCommand(\"researcherinfo\");'>\n        button1\n      </button>\n    </div>\n\n    <div class=\"button-container\">\n      <button  (click)='commandRegistry.parseCommand(\"help\");'>\n        button2\n      </button>\n    </div>\n\n  \n\n    <div style=\"display:flex; justify-content:center; width:100%\">\n\n\n      <div class=\"button-container\">\n        <button (click)='commandRegistry.parseCommand(\"panel\")'>\n          add panel\n        </button>\n      </div>\n    </div>\n\n\n\n  </div>\n\n  <div id=\"splitContainer\" #splitContainer (mouseup)=\"splitContainerMouseUp($event)\"\n    (mouseup)=\"mouseUpWhileCommandOutputMouseDown()\" (mousemove)=\"splitContainerMousemove($event)\"\n    (mousemove)=\"mouseMoveWhileCommandOutputMouseDown($event)\"\n    (commandOutputHeaderHasMouseDown)=\"commandOutputHeaderHasMouseDown($event)\">\n\n    <div #movingProxy class=\"movingProxy\"></div>\n\n    <div #splitChild *ngFor=\"let split of commandOutputComponentLists;let i=index;\" class=\"split\"\n      [style.width]=\"splitWidthArr[i] +  '%'\" (click)=\"selectSplitFromEmptyPanelClick($event, i)\">\n\n      <div class=\"splitContent\" style=\"position:relative; width:100%; height:100%\">\n\n        <div *ngIf=\"commandOutputComponentLists.length>0\" class=\"separatorHeader\" [class.active]=\"activeTab==i\"\n          (click)=\"selectSplit(i)\">\n\n          <div *ngIf=\"commandComponentHistories[i].length==0\" class=\"panelTitle mat-caption\">panel {{i+1}}</div>\n\n\n\n\n          <ng-container *ngIf=\"commandComponentHistories[i].length>0\">\n              \n            \n\n            <div style=\"width:100%;  display:flex; position:relative; justify-items: flex-start; justify-content: left\">\n              <div  class=\"panelTitle mat-caption\" style=\"width:80%; text-align: left\">panel {{i+1}}</div>\n            \n              <div style=\"display:flex; margin-right:30px\">\n                <div class=\"mat-select-label\" (click)=\"openMatSelectForCommandHistories(i)\">{{commandComponentHistories[i][commandComponentHistories[i].length-1]}}\n                </div>\n                <div>\n                  <!-- <mat-select #matSelectForCommandHistories style=\"display:block\">\n                    <mat-option *ngFor=\"let historyEntry of commandComponentHistories[i]; let h=index\"\n                      (click)=\"bringCommandOutputHistoryToFront($event, i, h)\">{{historyEntry}}\n                    </mat-option>\n                  </mat-select> -->\n                </div>\n              </div>\n\n\n            </div>\n          </ng-container>\n\n          <div *ngIf=\"commandOutputComponentLists.length>1\">\n            <!-- <ion-icon class=\"separatorCloseIcon\" name=\"close\" (click)=\"closeSplit($event, i)\"></ion-icon> -->\n            <span class=\"close-button\" name=\"close-circle\"><img src=\"/assets/close-icon.svg\"> </span>\n          </div>\n        </div>\n\n        <div class=\"commandOutputComponentsContainer\" (commandStringDispatched)=\"commandStringReceived($event)\"\n          (commandIssued)=\"commandIssued($event, i)\">\n\n\n          <div class=\"outputContainer\" [class.takeHeightAway]=\"splitSeparatorArr.length>1\" #outputContainer\n            (commandOutputComponentInitialized)=\"scrollToBottom()\" (scrollToBottom)=\"scrollToBottom()\"\n            (update)=\"changeDetector.detectChanges()\" (bringCommandOutputToFront)=\"bringCommandOutputToFront($event,i)\"\n            (destroyCommandOutput)=\"destroyCommandOutputEvent($event, i)\">\n            <ng-container id=\"output\" #output></ng-container>\n\n\n          </div>\n\n\n          <div class=\"commandLineContainer\" (commandIssued)=\"commandIssued($event,i)\" data-helpitem=\"about.md\">\n            <command-line #commandLine></command-line>\n          </div>\n\n        </div>\n\n\n\n      </div>\n\n\n\n      <div *ngIf=\"shouldRenderSeparator(i)\" [attr.data-index]=i class=\"splitSeparator\"\n        (mousedown)=\"splitSeparatorMousedown($event ,i)\" (mouseup)=\"splitSeparatorMouseup($event, i)\">\n\n\n      </div>\n\n\n\n    </div>\n\n\n\n  </div>\n\n</div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html":
/*!**************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- The content below is only a placeholder and can be replaced.\n<div style=\"text-align:center\">\n  <h1>\n    Welcome to {{ title }}!\n  </h1>\n  <img width=\"300\" alt=\"Angular Logo\" src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==\">\n</div>\n<h2>Here are some links to help you start: </h2>\n<ul>\n  <li>\n    <h2><a target=\"_blank\" rel=\"noopener\" href=\"https://angular.io/tutorial\">Tour of Heroes</a></h2>\n  </li>\n  <li>\n    <h2><a target=\"_blank\" rel=\"noopener\" href=\"https://angular.io/cli\">CLI Documentation</a></h2>\n  </li>\n  <li>\n    <h2><a target=\"_blank\" rel=\"noopener\" href=\"https://blog.angular.io/\">Angular blog</a></h2>\n  </li>\n</ul> -->\n\n<router-outlet></router-outlet>\n\n<div style=\"padding:20px\">\n<lib-pulseCLI #pulse disable tabindex=\"-1\"></lib-pulseCLI>\n</div>");

/***/ }),

/***/ "./projects/pulse-cli/src/lib/command-line.component/command-line.component.scss":
/*!***************************************************************************************!*\
  !*** ./projects/pulse-cli/src/lib/command-line.component/command-line.component.scss ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (":host {\n  position: relative;\n  width: 100%;\n}\n\ntextarea {\n  width: 100%;\n}\n\n#divArea {\n  margin: 0px auto;\n  color: #000;\n  min-width: 50px;\n  padding-left: 25px;\n  font-size: 14px;\n  font-weight: bold;\n  -webkit-user-select: text;\n     -moz-user-select: text;\n      -ms-user-select: text;\n          user-select: text;\n  font-family: \"IBM Plex Mono\", monospace;\n}\n\n#divArea::before {\n  content: \" > \";\n  font-size: 14px;\n  margin-left: -22px;\n}\n\n#divArea:focus {\n  border: none;\n}\n\n[contenteditable]:focus {\n  outline: 0px solid transparent;\n}\n\npre:focus {\n  border: solid pink;\n}\n\n.command {\n  color: black;\n  font-size: 18px;\n  font-weight: bold;\n}\n\n.glow {\n  -webkit-animation: glow 2s ease-in-out infinite alternate;\n  animation: glow 2s ease-in-out infinite alternate;\n}\n\n@-webkit-keyframes glow {\n  from {\n    text-shadow: 0 0 5px #82bd1d, 0 0 10px #82bd1d;\n  }\n  to {\n    text-shadow: 0 0 10px limegreen, 0 0 15px limegreen;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3RzL3B1bHNlLWNsaS9zcmMvbGliL2NvbW1hbmQtbGluZS5jb21wb25lbnQvY29tbWFuZC1saW5lLmNvbXBvbmVudC5zY3NzIiwicHJvamVjdHMvcHVsc2UtY2xpL3NyYy9saWIvX3ZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0Usa0JBQUE7RUFDQSxXQUFBO0FBREY7O0FBR0E7RUFDRSxXQUFBO0FBQUY7O0FBR0E7RUFDRSxnQkFBQTtFQUNBLFdDa0N5QjtFRGpDekIsZUFBQTtFQUVBLGtCQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0VBQ0EseUJBQUE7S0FBQSxzQkFBQTtNQUFBLHFCQUFBO1VBQUEsaUJBQUE7RUFDQSx1Q0FBQTtBQURGOztBQUlBO0VBRUUsY0FBQTtFQUNBLGVBQUE7RUFDQSxrQkFBQTtBQUZGOztBQUtBO0VBQ0ksWUFBQTtBQUZKOztBQUlBO0VBQ0ksOEJBQUE7QUFESjs7QUFJQTtFQUNJLGtCQUFBO0FBREo7O0FBR0E7RUFDRSxZQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0FBQUY7O0FBR0E7RUFDRSx5REFBQTtFQUVBLGlEQUFBO0FBQUY7O0FBR0E7RUFDRTtJQUNFLDhDQUFBO0VBQUY7RUFHQTtJQUNFLG1EQUFBO0VBREY7QUFDRiIsImZpbGUiOiJwcm9qZWN0cy9wdWxzZS1jbGkvc3JjL2xpYi9jb21tYW5kLWxpbmUuY29tcG9uZW50L2NvbW1hbmQtbGluZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgXCIuLi9fdmFyaWFibGVzLnNjc3NcIjtcblxuOmhvc3Qge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiAxMDAlO1xufVxudGV4dGFyZWEge1xuICB3aWR0aDogMTAwJTtcbn1cblxuI2RpdkFyZWEge1xuICBtYXJnaW46IDBweCBhdXRvO1xuICBjb2xvcjogJGNvbW1hbmQtbGluZS1mb3JlZ3JvdW5kO1xuICBtaW4td2lkdGg6IDUwcHg7XG4gIC8vIGJvcmRlci1ib3R0b206c29saWQgdGhpbjtcbiAgcGFkZGluZy1sZWZ0OiAyNXB4O1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OmJvbGQ7XG4gIHVzZXItc2VsZWN0OiB0ZXh0O1xuICBmb250LWZhbWlseTogJ0lCTSBQbGV4IE1vbm8nLCBtb25vc3BhY2U7XG59XG5cbiNkaXZBcmVhOjpiZWZvcmUge1xuICAvLyAgY29udGVudDpcIlxcMDFGOTE2XCI7XG4gIGNvbnRlbnQ6IFwiID4gXCI7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgbWFyZ2luLWxlZnQ6IC0yMnB4O1xufVxuXG4jZGl2QXJlYTpmb2N1c3tcbiAgICBib3JkZXI6bm9uZTtcbn1cbltjb250ZW50ZWRpdGFibGVdOmZvY3VzIHtcbiAgICBvdXRsaW5lOiAwcHggc29saWQgdHJhbnNwYXJlbnQ7XG59XG5cbnByZTpmb2N1c3tcbiAgICBib3JkZXI6c29saWQgcGluaztcbn1cbi5jb21tYW5kIHtcbiAgY29sb3I6IGJsYWNrO1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4uZ2xvdyB7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiBnbG93IDJzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZTtcbiAgLW1vei1hbmltYXRpb246IGdsb3cgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlO1xuICBhbmltYXRpb246IGdsb3cgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG5ALXdlYmtpdC1rZXlmcmFtZXMgZ2xvdyB7XG4gIGZyb20ge1xuICAgIHRleHQtc2hhZG93OiAwIDAgNXB4ICM4MmJkMWQsIDAgMCAxMHB4ICM4MmJkMWQ7XG4gIH1cblxuICB0byB7XG4gICAgdGV4dC1zaGFkb3c6IDAgMCAxMHB4IGxpbWVncmVlbiwgMCAwIDE1cHggbGltZWdyZWVuO1xuICB9XG59XG4iLCIvLyAvLyBJbXBvcnQgbWF0ZXJpYWwgdGhlbWluZyBmdW5jdGlvbnNcbi8vIC8vIEBpbXBvcnQgJ35AYW5ndWxhci9tYXRlcmlhbC90aGVtaW5nJztcblxuLy8gLy8gQ29weSB0aGUgcGFsZXR0ZXMgZnJvbSB5b3VyIHNlbGVjdGVkIHRoZW1lICh1c3VhbGx5IHRoZW1lLnNjc3MpLlxuLy8gJGFwcC1wcmltYXJ5OiBtYXQtcGFsZXR0ZSgkbWF0LWdyYXkpO1xuLy8gJGFwcC1zZWNvbmRhcnk6bWF0LXBhbGV0dGUoJG1hdC1wdXJwbGUpO1xuLy8gJGFwcC1hY2NlbnQ6ICBtYXQtcGFsZXR0ZSgkbWF0LXBpbmspO1xuLy8gJGFwcC13YXJuOiAgICBtYXQtcGFsZXR0ZSgkbWF0LWRlZXAtb3JhbmdlKTtcbi8vICR0aGVtZTogbWF0LWxpZ2h0LXRoZW1lKCRhcHAtcHJpbWFyeSwkYXBwLWFjY2VudCwkYXBwLXdhcm4pO1xuLy8gLy8gQ3JlYXRlIHlvdXIgU2FzcyBjb2xvciB2YXJzICh3aWxsIGJlIGF2YWlsYWJsZSBpbiBhbGwgdGhlIHByb2plY3QpXG5cblxuLy8gJHByaW1hcnk6IG1hdC1jb2xvcigkYXBwLXByaW1hcnksIDYwMCk7XG4vLyAkcHJpbWFyeS1saWdodC12YXJpYW50OiBtYXQtY29sb3IoJGFwcC1wcmltYXJ5LCAyMDApO1xuLy8gJHByaW1hcnktZGFyay12YXJpYW50OiBtYXQtY29sb3IoJGFwcC1wcmltYXJ5LCA4MDApO1xuXG4vLyAkc2Vjb25kYXJ5OiBtYXQtY29sb3IoJGFwcC1zZWNvbmRhcnksNTAwKTtcbi8vICRzZWNvbmRhcnktbGlnaHQtdmFyaWFudDogbWF0LWNvbG9yKCRhcHAtc2Vjb25kYXJ5LDIwMCk7XG4vLyAkc2Vjb25kYXJ5LWRhcmstdmFyaWFudDogbWF0LWNvbG9yKCRhcHAtc2Vjb25kYXJ5LDcwMCk7XG5cblxuLy8gJGFjY2VudDogbWF0LWNvbG9yKCRhcHAtYWNjZW50KTtcbi8vICRhY2NlbnQtaG92ZXI6IG1hdC1jb2xvcigkYXBwLXdhcm4sIDUwMCk7XG4vLyAkYWNjZW50LWxpZ2h0LXZhcmlhbnQ6IG1hdC1jb2xvcigkYXBwLWFjY2VudCwzMDApO1xuLy8gJGFjY2VudC1kYXJrLXZhcmlhbnQ6IG1hdC1jb2xvcigkYXBwLWFjY2VudCw3MDApO1xuXG5cbi8vICR3YXJuOiBtYXQtY29sb3IoJGFwcC13YXJuKTtcblxuLy8gJGJhY2tncm91bmQ6IG1hdC1jb2xvcihtYXAtZ2V0KCR0aGVtZSwgYmFja2dyb3VuZCkpO1xuLy8gJGZvcmVncm91bmQ6IG1hdC1jb2xvcihtYXAtZ2V0KCR0aGVtZSwgZm9yZWdyb3VuZCkpO1xuXG5cblxuLy8gJG91dHB1dC1ib3JkZXI6IG1hdC1jb2xvcigkYXBwLXByaW1hcnksMTAwKTtcbi8vICRvdXRwdXQtaGVhZGVyLWJhY2tncm91bmQ6IG1hdC1jb2xvcigkYXBwLXByaW1hcnksMTAwKTtcbi8vICRvdXRwdXQtaGVhZGVyLWZvcmVncm91bmQ6IG1hdC1jb2xvcigkYXBwLWFjY2VudCw3MDApO1xuLy8gJG91dHB1dC1oZWFkZXItYm9yZGVyLWJvdHRvbTptYXQtY29sb3IoJGFwcC1wcmltYXJ5LDMwMCk7XG5cbi8vICRvdXRwdXQtY29udGVudC1iYWNrZ3JvdW5kOiB3aGl0ZTtcblxuXG4vLyAkY29tbWFuZC1saW5lLWJhY2tncm91bmQ6IG1hdC1jb2xvcigkYXBwLXByaW1hcnksMTAwKTtcbi8vICRjb21tYW5kLWxpbmUtZm9yZWdyb3VuZDogJG91dHB1dC1oZWFkZXItZm9yZWdyb3VuZDtcblxuXG4kY29tbWFuZC1saW5lLWZvcmVncm91bmQgOiAjMDAwO1xuJGNvbW1hbmQtbGluZS1iYWNrZ3JvdW5kIDogI2ZmZmY7XG5cbiRmb3JlZ3JvdW5kOiAjMDAwO1xuJGJhY2tncm91bmQ6ICNmZmY7XG5cbiRhcHAtYWNjZW50OmJsdWU7XG4kYWNjZW50OiBwdXJwbGU7XG4kYWNjZW50LWxpZ2h0LXZhcmlhbnQ6cGluaztcblxuJHByaW1hcnktZGFyay12YXJpYW50OiBkYXJrZ3JheTtcblxuJG91dHB1dC1oZWFkZXItYmFja2dyb3VuZDogZGFya2dyZWVuO1xuJG91dHB1dC1oZWFkZXItZm9yZWdyb3VuZDogeWVsbG93O1xuJG91dHB1dC1oZWFkZXItYm9yZGVyLWJvdHRvbTogYXF1YTsiXX0= */");

/***/ }),

/***/ "./projects/pulse-cli/src/lib/command-line.component/command-line.component.ts":
/*!*************************************************************************************!*\
  !*** ./projects/pulse-cli/src/lib/command-line.component/command-line.component.ts ***!
  \*************************************************************************************/
/*! exports provided: CommandLineComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommandLineComponent", function() { return CommandLineComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _command_registry_service_command_registry_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../command-registry.service/command-registry.service */ "./projects/pulse-cli/src/lib/command-registry.service/command-registry.service.ts");


// import {SocketService} from '../../services/socket/socket.service';

// import {SuggestionBoxComponent} from '../suggestion-box/suggestion-box.component'
var CommandLineComponent = /** @class */ (function () {
    function CommandLineComponent(elementRef, renderer, commandRegistry) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.commandRegistry = commandRegistry;
        this.rejectionPhrases = ["no", "nope", "won't happen", "don't know this one", "ouch"];
        this.mode = "normal"; //TODO: determine how command should be parsed, support JS or other modes
        this.type = "main";
    }
    CommandLineComponent.prototype.ngOnInit = function () {
    };
    CommandLineComponent.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    CommandLineComponent.prototype.keydown = function (event) {
        //if it is arrow up or arrow down do something
        switch (event.keyCode) {
            case 9:
                //Tab
                event.preventDefault();
                event.stopPropagation();
                this.autofill();
                break;
            case 38:
                //up
                event.preventDefault();
                event.stopPropagation();
                var newText = this.commandRegistry.getFromHistory(-1);
                if (newText) {
                    this.divArea.nativeElement.innerText = newText;
                    var selection = window.getSelection();
                    selection.collapse(this.divArea.nativeElement.childNodes[this.divArea.nativeElement.childNodes.length - 1], newText.length);
                }
                // TODO: cycle through command history
                break;
            case 40:
                //down
                event.preventDefault();
                event.stopPropagation();
                var newText2 = this.commandRegistry.getFromHistory(1);
                if (newText2) {
                    this.divArea.nativeElement.innerText = newText2;
                    var selection2 = window.getSelection();
                    selection2.collapse(this.divArea.nativeElement.childNodes[this.divArea.nativeElement.childNodes.length - 1], newText2.length);
                }
                break;
        }
    };
    CommandLineComponent.prototype.autofill = function () {
        var content = this.divArea.nativeElement.innerText;
        var suggestions = this.commandRegistry.getAutofillSuggestions(content);
        if (suggestions.length === 1) {
            this.divArea.nativeElement.innerText = suggestions[0];
            var selection = window.getSelection();
            selection.collapse(this.divArea.nativeElement.childNodes[this.divArea.nativeElement.childNodes.length - 1], suggestions[0].length);
        }
        else if (suggestions.length > 1) {
            // this.suggestionBox.suggestions = suggestions;
            // this.suggestionBox.hidden=false;
        }
    };
    CommandLineComponent.prototype.suggestionSelected = function (event) {
        this.setText(event.detail);
        // this.suggestionBox.hidden=true;
        this.setFocusToCommandLine();
    };
    CommandLineComponent.prototype.setFocusToCommandLine = function () {
        this.divArea.nativeElement.focus();
        var selection = window.getSelection();
        if (this.divArea.nativeElement.childNodes.length) {
            selection.collapse(this.divArea.nativeElement.childNodes[this.divArea.nativeElement.childNodes.length - 1], this.divArea.nativeElement.innerText.length);
        }
        else {
            selection.collapse(this.divArea.nativeElement, this.divArea.nativeElement.innerText.length);
        }
    };
    CommandLineComponent.prototype.say = function (what, howlong) {
        var _this = this;
        this.speechBubbleContent.nativeElement.innerHTML = what;
        this.showBubbleContainer();
        if (howlong) {
            setTimeout(function () {
                _this.hideBubbleContainer();
            }, howlong);
        }
        else {
            //enable closing button
        }
    };
    CommandLineComponent.prototype.speak = function (what) {
        var phrase = new SpeechSynthesisUtterance(what);
        phrase.voice = window.speechSynthesis.getVoices()[11];
        window.speechSynthesis.speak(phrase);
    };
    CommandLineComponent.prototype.speakAndSay = function (what, howlong) {
        this.say(what, howlong);
        this.speak(what);
    };
    CommandLineComponent.prototype.keypress = function (event) {
        // debugger;
        if (event.keyCode == 13) {
            if (event.shiftKey) {
                //TODO: shift+return was pressed, do something different
            }
            else {
                //  Enter was pressed
                var commandString = this.divArea.nativeElement.innerText.trim();
                this.elementRef.nativeElement.dispatchEvent(new CustomEvent('commandIssued', { detail: { command: commandString, local: false, enterIntoHistory: true }, bubbles: true }));
                return false;
            }
        }
    };
    CommandLineComponent.prototype.clear = function () {
        this.renderer.setProperty(this.divArea.nativeElement, 'innerHTML', '');
    };
    CommandLineComponent.prototype.setText = function (text) {
        this.divArea.nativeElement.innerText = text;
        // let selection = window.getSelection();
        // selection.collapse( this.divArea.nativeElement.childNodes[ this.divArea.nativeElement.childNodes.length-1], this.divArea.nativeElement.innerText.length)
    };
    CommandLineComponent.prototype.hideBubbleContainer = function () {
        var _this = this;
        this.renderer.setStyle(this.speechBubbleContainer.nativeElement, 'opacity', '0');
        setTimeout(function () {
            _this.renderer.setStyle(_this.speechBubbleContainer.nativeElement, 'display', 'none');
        }, 600);
    };
    CommandLineComponent.prototype.showBubbleContainer = function () {
        this.renderer.setStyle(this.speechBubbleContainer.nativeElement, 'display', 'block');
        this.renderer.setStyle(this.speechBubbleContainer.nativeElement, 'opacity', '1');
    };
    CommandLineComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"] },
        { type: _command_registry_service_command_registry_service__WEBPACK_IMPORTED_MODULE_2__["CommandRegistryService"] }
    ]; };
    CommandLineComponent.propDecorators = {
        command: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"], args: ['command',] }],
        divArea: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ['divArea', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], static: true },] }],
        belowDivArea: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ['belowDivArea', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] },] }],
        speechBubbleContent: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ['speechBubbleContent', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], static: true },] }],
        speechBubbleContainer: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ['speechBubbleContainer', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], static: true },] }]
    };
    CommandLineComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'command-line',
            template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! raw-loader!./command-line.component.html */ "./node_modules/raw-loader/dist/cjs.js!./projects/pulse-cli/src/lib/command-line.component/command-line.component.html")).default,
            styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! ./command-line.component.scss */ "./projects/pulse-cli/src/lib/command-line.component/command-line.component.scss")).default]
        }),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"],
            _command_registry_service_command_registry_service__WEBPACK_IMPORTED_MODULE_2__["CommandRegistryService"]])
    ], CommandLineComponent);
    return CommandLineComponent;
}());



/***/ }),

/***/ "./projects/pulse-cli/src/lib/command-line.component/command-line.module.ts":
/*!**********************************************************************************!*\
  !*** ./projects/pulse-cli/src/lib/command-line.component/command-line.module.ts ***!
  \**********************************************************************************/
/*! exports provided: CommandLineComponentModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommandLineComponentModule", function() { return CommandLineComponentModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _command_line_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./command-line.component */ "./projects/pulse-cli/src/lib/command-line.component/command-line.component.ts");


// import { IonicModule } from '@ionic/angular';


// import { SuggestionBoxComponentModule } from '../suggestion-box/suggestion-box.module';
var CommandLineComponentModule = /** @class */ (function () {
    function CommandLineComponentModule() {
    }
    CommandLineComponentModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _command_line_component__WEBPACK_IMPORTED_MODULE_3__["CommandLineComponent"],
            ],
            imports: [
                // IonicModule,
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                // SuggestionBoxComponentModule,
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]
            ],
            exports: [
                _command_line_component__WEBPACK_IMPORTED_MODULE_3__["CommandLineComponent"]
            ]
        })
    ], CommandLineComponentModule);
    return CommandLineComponentModule;
}());



/***/ }),

/***/ "./projects/pulse-cli/src/lib/command-output.component/command-output.component.scss":
/*!*******************************************************************************************!*\
  !*** ./projects/pulse-cli/src/lib/command-output.component/command-output.component.scss ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (":host {\n  position: absolute;\n  display: block;\n  width: 100%;\n  height: 100%;\n  background-color: #fff;\n  overflow: hidden;\n  top: 500px;\n  opacity: 1;\n  transition: opacity 0.3s ease, top 0.3s ease;\n  box-shadow: 0px -5px 10px -2px rgba(0, 0, 0, 0.55);\n  border: solid 2px #444;\n  border-radius: 3px 3px;\n}\n\n.outerContainer {\n  position: relative;\n}\n\n.outputHeader {\n  height: 40px;\n  display: flex;\n  justify-content: space-between;\n  justify-content: first-baseline;\n  background-color: darkgreen;\n  padding-top: 5px;\n  padding-left: 5px;\n  padding-right: 5px;\n  border-bottom: solid 1px aqua;\n}\n\n.commandString {\n  padding: 3px;\n  padding-bottom: 0px;\n  font-family: \"IBM Plex Mono\", monospace;\n  font-weight: bold;\n  font-size: 14px;\n  color: yellow;\n  margin: 0px auto;\n  display: block;\n  width: 100%;\n}\n\n.close-button {\n  color: darkgray;\n  transition: color 0.5s;\n}\n\n.close-button:hover {\n  color: purple;\n}\n\n.outerContainer {\n  z-index: 2;\n  overflow: hidden;\n  background-color: #fff;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n\n.contentContainer {\n  overflow-y: auto;\n  overflow-x: auto;\n  height: 100%;\n  background: #F0F0F0;\n  padding: 20px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3RzL3B1bHNlLWNsaS9zcmMvbGliL2NvbW1hbmQtb3V0cHV0LmNvbXBvbmVudC9jb21tYW5kLW91dHB1dC5jb21wb25lbnQuc2NzcyIsInByb2plY3RzL3B1bHNlLWNsaS9zcmMvbGliL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNFLGtCQUFBO0VBRUEsY0FBQTtFQUVBLFdBQUE7RUFDQSxZQUFBO0VBRUEsc0JDd0NXO0VEdkNYLGdCQUFBO0VBQ0EsVUFBQTtFQUNBLFVBQUE7RUFDQSw0Q0FBQTtFQUVBLGtEQUFBO0VBRUEsc0JBQUE7RUFHQSxzQkFBQTtBQVJGOztBQVlBO0VBQ0Usa0JBQUE7QUFURjs7QUFZQTtFQUVFLFlBQUE7RUFDQSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSwrQkFBQTtFQUdBLDJCQ3FCeUI7RURwQnpCLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLDZCQUFBO0FBWkY7O0FBZUE7RUFDRSxZQUFBO0VBQ0EsbUJBQUE7RUFFQSx1Q0FBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtFQUVBLGFDT3lCO0VETHpCLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLFdBQUE7QUFmRjs7QUFrQkE7RUFDSSxlQ0ptQjtFREtyQixzQkFBQTtBQWZGOztBQWtCQTtFQUNFLGFDWk87QURIVDs7QUFtQkE7RUFDRSxVQUFBO0VBQ0EsZ0JBQUE7RUFFQSxzQkN2Qlc7RUR3QlgsWUFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtBQWpCRjs7QUFvQkE7RUFDRSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUVBLG1CQUFBO0VBQ0EsYUFBQTtBQWxCRiIsImZpbGUiOiJwcm9qZWN0cy9wdWxzZS1jbGkvc3JjL2xpYi9jb21tYW5kLW91dHB1dC5jb21wb25lbnQvY29tbWFuZC1vdXRwdXQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0IFwiLi4vX3ZhcmlhYmxlcy5zY3NzXCI7XG5cbjpob3N0IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gIGRpc3BsYXk6IGJsb2NrO1xuXG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIC8vIGJhY2tncm91bmQtY29sb3I6ICMzYTNhM2E7XG4gIGJhY2tncm91bmQtY29sb3I6JGJhY2tncm91bmQ7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHRvcDogNTAwcHg7XG4gIG9wYWNpdHk6IDE7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcyBlYXNlLCB0b3AgMC4zcyBlYXNlO1xuXG4gIGJveC1zaGFkb3c6IDBweCAtNXB4IDEwcHggLTJweCByZ2JhKDAsIDAsIDAsIDAuNTUpO1xuICBcbiAgYm9yZGVyOnNvbGlkIDJweCAjNDQ0O1xuXG5cbiAgYm9yZGVyLXJhZGl1czogM3B4IDNweDtcbn1cblxuXG4ub3V0ZXJDb250YWluZXJ7XG4gIHBvc2l0aW9uOnJlbGF0aXZlO1xufVxuXG4ub3V0cHV0SGVhZGVyIHtcblxuICBoZWlnaHQ6IDQwcHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAganVzdGlmeS1jb250ZW50OiBmaXJzdC1iYXNlbGluZTtcblxuXG4gIGJhY2tncm91bmQtY29sb3I6JG91dHB1dC1oZWFkZXItYmFja2dyb3VuZDtcbiAgcGFkZGluZy10b3A6IDVweDtcbiAgcGFkZGluZy1sZWZ0OiA1cHg7XG4gIHBhZGRpbmctcmlnaHQ6NXB4O1xuICBib3JkZXItYm90dG9tOnNvbGlkIDFweCAkb3V0cHV0LWhlYWRlci1ib3JkZXItYm90dG9tO1xufVxuXG4uY29tbWFuZFN0cmluZyB7XG4gIHBhZGRpbmc6IDNweDtcbiAgcGFkZGluZy1ib3R0b206MHB4O1xuICAvLyBmb250LWZhbWlseTogbW9ub3NwYWNlO1xuICBmb250LWZhbWlseTogJ0lCTSBQbGV4IE1vbm8nLCBtb25vc3BhY2U7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXNpemU6IDE0cHg7XG4gIC8vIGZvbnQtc2l6ZTogMC43ZW07XG4gIGNvbG9yOiAkb3V0cHV0LWhlYWRlci1mb3JlZ3JvdW5kO1xuICBcbiAgbWFyZ2luOiAwcHggYXV0bztcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uY2xvc2UtYnV0dG9uIHtcbiAgICBjb2xvcjokcHJpbWFyeS1kYXJrLXZhcmlhbnQ7XG4gIHRyYW5zaXRpb246IGNvbG9yIDAuNXM7XG59XG5cbi5jbG9zZS1idXR0b246aG92ZXIge1xuICBjb2xvcjogJGFjY2VudDtcbn1cblxuXG4ub3V0ZXJDb250YWluZXIge1xuICB6LWluZGV4OiAyO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBcbiAgYmFja2dyb3VuZC1jb2xvcjokYmFja2dyb3VuZDtcbiAgaGVpZ2h0OiAxMDAlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xufVxuXG4uY29udGVudENvbnRhaW5lciB7XG4gIG92ZXJmbG93LXk6IGF1dG87XG4gIG92ZXJmbG93LXg6YXV0bztcbiAgaGVpZ2h0OiAxMDAlO1xuICAvLyBib3JkZXI6c29saWQgdGhpY2sgeWVsbG93O1xuICBiYWNrZ3JvdW5kOiNGMEYwRjA7XG4gIHBhZGRpbmc6IDIwcHg7XG59XG5cblxuXG4vLyAub3V0cHV0Q29udGFpbmVyIGNvbW1hbmQtb3V0cHV0IC5jb250ZW50Q29udGFpbmVye1xuLy8gICAgIGRpc3BsYXk6bm9uZTtcbi8vIH1cbi8vIC5vdXRwdXRDb250YWluZXIgY29tbWFuZC1vdXRwdXQ6bGFzdC1jaGlsZCAuY29udGVudENvbnRhaW5lcntcbi8vICAgICBkaXNwbGF5OmJsb2NrO1xuLy8gfVxuIiwiLy8gLy8gSW1wb3J0IG1hdGVyaWFsIHRoZW1pbmcgZnVuY3Rpb25zXG4vLyAvLyBAaW1wb3J0ICd+QGFuZ3VsYXIvbWF0ZXJpYWwvdGhlbWluZyc7XG5cbi8vIC8vIENvcHkgdGhlIHBhbGV0dGVzIGZyb20geW91ciBzZWxlY3RlZCB0aGVtZSAodXN1YWxseSB0aGVtZS5zY3NzKS5cbi8vICRhcHAtcHJpbWFyeTogbWF0LXBhbGV0dGUoJG1hdC1ncmF5KTtcbi8vICRhcHAtc2Vjb25kYXJ5Om1hdC1wYWxldHRlKCRtYXQtcHVycGxlKTtcbi8vICRhcHAtYWNjZW50OiAgbWF0LXBhbGV0dGUoJG1hdC1waW5rKTtcbi8vICRhcHAtd2FybjogICAgbWF0LXBhbGV0dGUoJG1hdC1kZWVwLW9yYW5nZSk7XG4vLyAkdGhlbWU6IG1hdC1saWdodC10aGVtZSgkYXBwLXByaW1hcnksJGFwcC1hY2NlbnQsJGFwcC13YXJuKTtcbi8vIC8vIENyZWF0ZSB5b3VyIFNhc3MgY29sb3IgdmFycyAod2lsbCBiZSBhdmFpbGFibGUgaW4gYWxsIHRoZSBwcm9qZWN0KVxuXG5cbi8vICRwcmltYXJ5OiBtYXQtY29sb3IoJGFwcC1wcmltYXJ5LCA2MDApO1xuLy8gJHByaW1hcnktbGlnaHQtdmFyaWFudDogbWF0LWNvbG9yKCRhcHAtcHJpbWFyeSwgMjAwKTtcbi8vICRwcmltYXJ5LWRhcmstdmFyaWFudDogbWF0LWNvbG9yKCRhcHAtcHJpbWFyeSwgODAwKTtcblxuLy8gJHNlY29uZGFyeTogbWF0LWNvbG9yKCRhcHAtc2Vjb25kYXJ5LDUwMCk7XG4vLyAkc2Vjb25kYXJ5LWxpZ2h0LXZhcmlhbnQ6IG1hdC1jb2xvcigkYXBwLXNlY29uZGFyeSwyMDApO1xuLy8gJHNlY29uZGFyeS1kYXJrLXZhcmlhbnQ6IG1hdC1jb2xvcigkYXBwLXNlY29uZGFyeSw3MDApO1xuXG5cbi8vICRhY2NlbnQ6IG1hdC1jb2xvcigkYXBwLWFjY2VudCk7XG4vLyAkYWNjZW50LWhvdmVyOiBtYXQtY29sb3IoJGFwcC13YXJuLCA1MDApO1xuLy8gJGFjY2VudC1saWdodC12YXJpYW50OiBtYXQtY29sb3IoJGFwcC1hY2NlbnQsMzAwKTtcbi8vICRhY2NlbnQtZGFyay12YXJpYW50OiBtYXQtY29sb3IoJGFwcC1hY2NlbnQsNzAwKTtcblxuXG4vLyAkd2FybjogbWF0LWNvbG9yKCRhcHAtd2Fybik7XG5cbi8vICRiYWNrZ3JvdW5kOiBtYXQtY29sb3IobWFwLWdldCgkdGhlbWUsIGJhY2tncm91bmQpKTtcbi8vICRmb3JlZ3JvdW5kOiBtYXQtY29sb3IobWFwLWdldCgkdGhlbWUsIGZvcmVncm91bmQpKTtcblxuXG5cbi8vICRvdXRwdXQtYm9yZGVyOiBtYXQtY29sb3IoJGFwcC1wcmltYXJ5LDEwMCk7XG4vLyAkb3V0cHV0LWhlYWRlci1iYWNrZ3JvdW5kOiBtYXQtY29sb3IoJGFwcC1wcmltYXJ5LDEwMCk7XG4vLyAkb3V0cHV0LWhlYWRlci1mb3JlZ3JvdW5kOiBtYXQtY29sb3IoJGFwcC1hY2NlbnQsNzAwKTtcbi8vICRvdXRwdXQtaGVhZGVyLWJvcmRlci1ib3R0b206bWF0LWNvbG9yKCRhcHAtcHJpbWFyeSwzMDApO1xuXG4vLyAkb3V0cHV0LWNvbnRlbnQtYmFja2dyb3VuZDogd2hpdGU7XG5cblxuLy8gJGNvbW1hbmQtbGluZS1iYWNrZ3JvdW5kOiBtYXQtY29sb3IoJGFwcC1wcmltYXJ5LDEwMCk7XG4vLyAkY29tbWFuZC1saW5lLWZvcmVncm91bmQ6ICRvdXRwdXQtaGVhZGVyLWZvcmVncm91bmQ7XG5cblxuJGNvbW1hbmQtbGluZS1mb3JlZ3JvdW5kIDogIzAwMDtcbiRjb21tYW5kLWxpbmUtYmFja2dyb3VuZCA6ICNmZmZmO1xuXG4kZm9yZWdyb3VuZDogIzAwMDtcbiRiYWNrZ3JvdW5kOiAjZmZmO1xuXG4kYXBwLWFjY2VudDpibHVlO1xuJGFjY2VudDogcHVycGxlO1xuJGFjY2VudC1saWdodC12YXJpYW50OnBpbms7XG5cbiRwcmltYXJ5LWRhcmstdmFyaWFudDogZGFya2dyYXk7XG5cbiRvdXRwdXQtaGVhZGVyLWJhY2tncm91bmQ6IGRhcmtncmVlbjtcbiRvdXRwdXQtaGVhZGVyLWZvcmVncm91bmQ6IHllbGxvdztcbiRvdXRwdXQtaGVhZGVyLWJvcmRlci1ib3R0b206IGFxdWE7Il19 */");

/***/ }),

/***/ "./projects/pulse-cli/src/lib/command-output.component/command-output.component.ts":
/*!*****************************************************************************************!*\
  !*** ./projects/pulse-cli/src/lib/command-output.component/command-output.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: CommandOutputComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommandOutputComponent", function() { return CommandOutputComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _pulse_cli_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pulse-cli.service */ "./projects/pulse-cli/src/lib/pulse-cli.service.ts");
/* harmony import */ var _command_registry_service_command_registry_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../command-registry.service/command-registry.service */ "./projects/pulse-cli/src/lib/command-registry.service/command-registry.service.ts");




var CommandOutputComponent = /** @class */ (function () {
    function CommandOutputComponent(element, viewContainerRef, changeDetector, renderer, global, commandRegistry) {
        this.element = element;
        this.viewContainerRef = viewContainerRef;
        this.changeDetector = changeDetector;
        this.renderer = renderer;
        this.global = global;
        this.commandRegistry = commandRegistry;
        this.commandOutputComponentInitialized = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"];
        this.isHidden = false;
        this.myHTML = "";
        this.splitContainerIndex = 0;
        this.callbacksBeforeDestruction = [];
    }
    CommandOutputComponent_1 = CommandOutputComponent;
    CommandOutputComponent.prototype.ngOnInit = function () { };
    CommandOutputComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.element.nativeElement.dispatchEvent(new CustomEvent("commandOutputComponentInitialized", { bubbles: true }));
        // this.element.nativeElement.scrollIntoView({behavior:"smooth"})
        this.renderer.listen(this.element.nativeElement, "saveDocument", function (data) {
            _this.commandRegistry.parseCommand("import document", { args: { options: { name: data.detail.name, string: data.detail.content, databaseId: data.detail.databaseId, editorRef: data.detail.editorRef } } });
        });
    };
    CommandOutputComponent.prototype.updateCommandString = function (commandString) {
        this.commandString = commandString;
    };
    CommandOutputComponent.prototype.placeInContainer = function (htmlString) {
        this.myHTML = htmlString;
    };
    CommandOutputComponent.prototype.addHTMLToContainer = function (htmlString) {
        this.myHTML += htmlString;
    };
    CommandOutputComponent.prototype.placeViewContainerRefInContainer = function (componentRef) {
        this.viewContainerRef.insert(componentRef.hostView);
    };
    CommandOutputComponent.prototype.detectChanges = function () {
        this.changeDetector.markForCheck();
    };
    CommandOutputComponent.prototype.commandIssued = function (event) {
        if (event.detail.local) {
            event.stopPropagation();
        }
    };
    CommandOutputComponent.prototype.outputHeaderClicked = function () {
        this.element.nativeElement.dispatchEvent(new CustomEvent("bringCommandOutputToFront", { bubbles: true }));
    };
    CommandOutputComponent.prototype.outputHeaderMouseDown = function (event) {
        this.element.nativeElement.dispatchEvent(new CustomEvent("commandOutputHeaderHasMouseDown", { bubbles: true, detail: { element: this.element.nativeElement, mouseDownEvent: event } }));
    };
    CommandOutputComponent.prototype.outputHeaderMouseUp = function () {
        this.element.nativeElement.dispatchEvent(new CustomEvent("commandOutputHeaderHasMouseUp", { bubbles: true, detail: this.element.nativeElement }));
    };
    CommandOutputComponent.prototype.hideCommand = function () {
        // this.commandLine.element.nativeElement.style.display="none";
    };
    CommandOutputComponent.prototype.addDestructionCallback = function (f) {
        this.callbacksBeforeDestruction.push(f);
    };
    CommandOutputComponent.prototype.executeDestructionCallbacks = function () {
        for (var i = 0; i < this.callbacksBeforeDestruction.length; i++) {
            this.callbacksBeforeDestruction[i]();
        }
    };
    CommandOutputComponent.prototype.destroyCommandOutput = function (event) {
        event.stopPropagation();
        this.executeDestructionCallbacks();
        this.element.nativeElement.dispatchEvent(new CustomEvent("destroyCommandOutput", { bubbles: true }));
    };
    var CommandOutputComponent_1;
    CommandOutputComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"] },
        { type: _pulse_cli_service__WEBPACK_IMPORTED_MODULE_2__["PulseCLIService"] },
        { type: _command_registry_service_command_registry_service__WEBPACK_IMPORTED_MODULE_3__["CommandRegistryService"] }
    ]; };
    CommandOutputComponent.propDecorators = {
        commandOutputComponentInitialized: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"] }],
        container: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ['container', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], static: true },] }],
        commandLine: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ["commandline", { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"] },] }],
        nextContainer: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ["nextContainer", { read: CommandOutputComponent_1 },] }]
    };
    CommandOutputComponent = CommandOutputComponent_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'command-output',
            template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! raw-loader!./command-output.component.html */ "./node_modules/raw-loader/dist/cjs.js!./projects/pulse-cli/src/lib/command-output.component/command-output.component.html")).default,
            styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! ./command-output.component.scss */ "./projects/pulse-cli/src/lib/command-output.component/command-output.component.scss")).default]
        }),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"],
            _pulse_cli_service__WEBPACK_IMPORTED_MODULE_2__["PulseCLIService"],
            _command_registry_service_command_registry_service__WEBPACK_IMPORTED_MODULE_3__["CommandRegistryService"]])
    ], CommandOutputComponent);
    return CommandOutputComponent;
}());



/***/ }),

/***/ "./projects/pulse-cli/src/lib/command-output.component/command-output.module.ts":
/*!**************************************************************************************!*\
  !*** ./projects/pulse-cli/src/lib/command-output.component/command-output.module.ts ***!
  \**************************************************************************************/
/*! exports provided: CommandOutputComponentModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommandOutputComponentModule", function() { return CommandOutputComponentModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _command_output_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./command-output.component */ "./projects/pulse-cli/src/lib/command-output.component/command-output.component.ts");
/* harmony import */ var _safe_html__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../safe-html */ "./projects/pulse-cli/src/lib/safe-html.ts");


// import { IonicModule } from '@ionic/angular';


// import { SuggestionBoxComponentModule } from '../suggestion-box/suggestion-box.module';

var CommandOutputComponentModule = /** @class */ (function () {
    function CommandOutputComponentModule() {
    }
    CommandOutputComponentModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _command_output_component__WEBPACK_IMPORTED_MODULE_3__["CommandOutputComponent"],
                _safe_html__WEBPACK_IMPORTED_MODULE_4__["SafeHtmlPipe"],
            ],
            imports: [
                // IonicModule,
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                // SuggestionBoxComponentModule,
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]
            ],
            exports: [
                _command_output_component__WEBPACK_IMPORTED_MODULE_3__["CommandOutputComponent"]
            ]
        })
    ], CommandOutputComponentModule);
    return CommandOutputComponentModule;
}());



/***/ }),

/***/ "./projects/pulse-cli/src/lib/command-registry.service/command-registry.service.ts":
/*!*****************************************************************************************!*\
  !*** ./projects/pulse-cli/src/lib/command-registry.service/command-registry.service.ts ***!
  \*****************************************************************************************/
/*! exports provided: CommandRegistryService, OpCommand, Option */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommandRegistryService", function() { return CommandRegistryService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OpCommand", function() { return OpCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Option", function() { return Option; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");



// import { MarkdownDisplayComponent } from '../../components/markdown-display/markdown-display.component';
// import { HelpItemComponent } from '../../components/help-item/help-item.component';
// import { Storage } from '@ionic/storage';
// import { ApiService } from "../api/api.service";

var CommandRegistryService = /** @class */ (function () {
    function CommandRegistryService(componentFactoryResolver, injector) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.injector = injector;
        this.commands = {};
        this.commandHistory = [];
        this.commandHistoryIndex = 0;
        this.commandSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.categories = {};
        var history = localStorage.history;
        try {
            this.commandHistory = JSON.parse(localStorage.history);
            this.commandHistoryIndex = this.commandHistory.length - 1;
        }
        catch (e) {
            console.warn("could not get history from localStorage");
        }
    }
    CommandRegistryService.prototype.addToHistory = function (commandString) {
        this.commandHistory.push(commandString);
        this.commandHistoryIndex = this.commandHistory.length;
        if (this.commandHistory.length > 100)
            this.commandHistory.shift();
        localStorage.history = JSON.stringify(this.commandHistory);
    };
    CommandRegistryService.prototype.getFromHistory = function (i) {
        this.commandHistoryIndex += i;
        if (this.commandHistoryIndex < 0)
            this.commandHistoryIndex = 0;
        if (this.commandHistoryIndex > this.commandHistory.length - 1)
            this.commandHistoryIndex = this.commandHistory.length - 1;
        return this.commandHistory[this.commandHistoryIndex];
    };
    CommandRegistryService.prototype.clearStartupCommands = function () {
        // this.storage.set("startupCommands", []);
    };
    CommandRegistryService.prototype.addToStartupCommands = function (cmd) {
        // this.storage.get("startupCommands").then(cmdList => {
        //   if (!cmdList) cmdList = [];
        //   cmdList.push(cmd);
        //   this.storage.set("startupCommands", cmdList)
        // })
    };
    CommandRegistryService.prototype.executeStartupCommands = function () {
        // this.storage.get('startupCommands').then(
        //   async (startupCommands) => {
        //   if (!startupCommands) return;
        //   let promise: any = Promise.resolve();
        //   for (let i = 0; i < startupCommands.length; i++) {
        //     await this.parseCommand(startupCommands[i]);    
        //   }
        // })
    };
    CommandRegistryService.prototype.registerCallbackWhenCommmandDoesNotExist = function (callback) {
        this.doesNotExistCallback = callback;
    };
    CommandRegistryService.prototype.command = function (commandName, description, category) {
        var cmd = new OpCommand(commandName, description);
        this.commands[cmd.name] = cmd;
        if (!this.categories[category]) {
            this.categories[category] = [];
        }
        this.categories[category].push(cmd);
        return cmd;
    };
    CommandRegistryService.prototype.isOption = function (string) {
        if (string.indexOf('-') == 0)
            return true;
    };
    CommandRegistryService.prototype.isLongOption = function (string) {
        if (string.indexOf('--') == 0)
            return true;
    };
    CommandRegistryService.prototype.isSwitch = function (bstring, index) {
        if (!this.isOption(bstring[index]))
            return false;
        else {
            if (!bstring[index + 1]) { }
        }
    };
    CommandRegistryService.prototype.findCommandObject = function (commandNameContainer) {
        //assuming that commandNameContainer is stripped of options
        var commandNamesList = Object.keys(this.commands).sort(function (a, b) {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });
        var commandObject = null;
        var args = [];
        var remainingCommandsList = commandNamesList;
        var existingCommandCandidate;
        var i = 1;
        while (commandNameContainer[i]) {
            existingCommandCandidate = commandNameContainer.substr(0, i);
            remainingCommandsList = remainingCommandsList.filter(function (cmd) {
                if (cmd.indexOf(existingCommandCandidate) == 0) {
                    return cmd;
                }
            });
            if (remainingCommandsList.length == 1) {
                break;
            }
            else {
                i++;
            }
        }
        if (remainingCommandsList.length == 1) {
            var restOfContents = commandNameContainer.substr(remainingCommandsList[0].length + 1).trim().split(" ");
            args = restOfContents.filter(function (item) {
                return item !== "";
            });
            commandObject = this.commands[remainingCommandsList[0]];
            return [commandObject, args];
        }
        else if (remainingCommandsList.length == 0) {
            return [null, null];
        }
        else if (remainingCommandsList.length > 1) {
            debugger;
            return [null, null];
        }
    };
    CommandRegistryService.prototype.replaceQuotedStringsWithIdentifiers = function (commandString) {
        var quotedStringRegexp = /(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/g;
        var subStringMap = {};
        var rCmdStr = commandString;
        var quotedSubStrings = commandString.match(quotedStringRegexp);
        //  replace them
        if (quotedSubStrings) {
            for (var i = 0; i < quotedSubStrings.length; i++) {
                var qKey = "_quotStr" + i;
                subStringMap[qKey] = quotedSubStrings[i];
                rCmdStr = rCmdStr.replace(quotedSubStrings[i], qKey);
            }
        }
        return [rCmdStr, subStringMap];
    };
    CommandRegistryService.prototype.parseCommand = function (commandString, indirectParams) {
        // this.api.saveCommandHistory(commandString, indirectParams || {}, {}, true);
        if (indirectParams)
            if (indirectParams.enterIntoHistory) {
                this.addToHistory(commandString);
            }
        // if ((commandString === "help") || (commandString === "?")) {
        //   return new Promise((resolve, reject) => {
        //     this.commands["help"].callback({ helpItems: this.compileHelp() }, "help", resolve, reject)
        //   })
        // }
        /*
        parsing strategy:
          first replace all quoted strings with placeholders,
          then separate switches from the first part of the string
          then look for positional arguments in first part of the string
          replace found arguments with corresponding quoted strings, if any
          then match argument-value pairs
          replace values with corresponding quoted strings, if any
        */
        var _a = this.replaceQuotedStringsWithIdentifiers(commandString), cmdString = _a[0], subStringMap = _a[1];
        //assuming there are no switches, cmdContainer contains commandName + positional arguments
        var cmdContainer = cmdString;
        //but if there are switches, isolate them
        if (cmdString.indexOf('-') != -1) {
            cmdContainer = cmdString.substr(0, cmdString.indexOf('-')).trim();
        }
        var _b = this.findCommandObject(cmdContainer), commandObject = _b[0], args = _b[1];
        if (!commandObject) {
            this.doesNotExistCallback({ commandName: cmdContainer });
            return;
        }
        var finalArguments = {};
        for (var i_1 = 0; i_1 < commandObject.arguments.length; i_1++) {
            //get the argName without braces;
            var argName = commandObject.arguments[i_1].substr(1, commandObject.arguments[i_1].length - 2);
            //are any of the positional arguments stand-ins for quoted strings?
            var s = subStringMap[args[i_1]];
            if (s) {
                //then assign that value instead, but without the quotes
                finalArguments[argName] = s.substr(1, s.length - 2);
            }
            else {
                //otherwise assign the regular value
                finalArguments[argName] = args[i_1];
            }
        }
        //if indirectParams has any keys, include these as well
        if (indirectParams)
            if (indirectParams.args) {
                var indirectParamKeys = Object.keys(indirectParams.args);
                for (var i_2 = 0; i_2 < indirectParamKeys.length; i_2++) {
                    if (indirectParamKeys[i_2] !== "options") {
                        finalArguments[indirectParamKeys[i_2]] = indirectParams.args[indirectParamKeys[i_2]];
                    }
                }
            }
        //match commandName, and argument-value pairs both with short (-) and long(--)
        // let nameAndArgRegexp = /.*?(?= -|$)/g
        // extract all short (-) arguments /-\b.*?\b(?= |$)/g
        // extract all long (--) arguments /-\b.*?\b(?= |$)/g
        // match both short and long arguments (--|-\w)(.*?)(?= |$);
        //  get argument-value pairs
        // match all argument-value pairs both with short and long: 
        var argValPairsRegexp = /(-|--).*?(?= -|$)/g;
        var argValPairs = cmdString.match(argValPairsRegexp) || [];
        //  now break them up in an options map;
        var optionsMap = {};
        for (var i = 0; i < argValPairs.length; i++) {
            var pair = argValPairs[i].split(' ').map(function (item) {
                return item.trim();
            });
            var k = pair[0]; // this is our key, the rest indices will be values
            if (!optionsMap[k]) {
                if (pair.length == 1) {
                    optionsMap[k] = true;
                }
                else {
                    optionsMap[k] = pair.slice(1);
                }
            }
            else {
                //  optionsMap[k] is already defined
                if (Array.isArray(optionsMap[k])) {
                    if (pair.length >= 2) {
                        optionsMap[k] = optionsMap[k].concat(pair.slice(1));
                    }
                }
                else {
                    //optionsMap[k] has value true
                    optionsMap[k] = pair.slice(1);
                }
            }
            //  now that we have optionsMap[k], might as well replace quoted Strings  
            //  but please do so without the quotes that contain them
            if (Array.isArray(optionsMap[k]))
                for (var q = 0; q < optionsMap[k].length; q++) {
                    var s = subStringMap[optionsMap[k][q]];
                    if (subStringMap[optionsMap[k][q]])
                        optionsMap[k][q] = s.substr(1, s.length - 2);
                }
        }
        //  now we need to concat short and long options
        var optArr = Object.keys(optionsMap);
        var finalOptions = {};
        for (var i_3 = 0; i_3 < commandObject.options.length; i_3++) {
            var cmdOpt = commandObject.options[i_3];
            for (var j = 0; j < optArr.length; j++) {
                //if it's long or short
                if ((cmdOpt.short == optArr[j]) || (cmdOpt.long == optArr[j])) {
                    var optname = cmdOpt.long.substr(2);
                    if (!finalOptions[optname]) {
                        finalOptions[optname] = [];
                    }
                    finalOptions[optname] = finalOptions[optname].concat(optionsMap[optArr[j]]);
                }
            }
        }
        //finally, include my indirect options as well
        if (indirectParams)
            if (indirectParams.args)
                if (indirectParams.args.options) {
                    var indirectKeys = Object.keys(indirectParams.args.options);
                    for (var i_4 = 0; i_4 < indirectKeys.length; i_4++) {
                        finalOptions[indirectKeys[i_4]] = indirectParams.args.options[indirectKeys[i_4]];
                    }
                }
        // build positional arguments
        finalArguments["options"] = finalOptions;
        return new Promise(function (resolve, reject) {
            var result = commandObject.callback(finalArguments || {}, commandString, resolve, reject);
            // resolve(result);
        });
    };
    CommandRegistryService.prototype.getAutofillSuggestions = function (content) {
        var suggestions = [];
        var commandNames = Object.keys(this.commands);
        for (var i = 0; i < commandNames.length; i++) {
            if (commandNames[i].indexOf(content) === 0) {
                suggestions.push(commandNames[i]);
            }
        }
        return suggestions;
    };
    CommandRegistryService.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injector"] }
    ]; };
    CommandRegistryService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injector"]])
    ], CommandRegistryService);
    return CommandRegistryService;
}());

var OpCommand = /** @class */ (function () {
    function OpCommand(commandString, description) {
        this.arguments = [];
        this.options = [];
        var argStartIndex1 = commandString.indexOf("<");
        var argStartIndex2 = commandString.indexOf("[");
        var argStartIndex = commandString.length;
        if ((argStartIndex1 != -1) && (argStartIndex2 != -1))
            argStartIndex = Math.min(argStartIndex1, argStartIndex2);
        else if ((argStartIndex1 === -1) && (argStartIndex2 !== -1))
            argStartIndex = argStartIndex2;
        else if ((argStartIndex1 !== -1) && (argStartIndex2 === -1))
            argStartIndex = argStartIndex1;
        this.name = commandString.substr(0, argStartIndex).trim();
        this.commandString = commandString;
        this.arguments = commandString.match(/[\<\[]\w*[\>\]]/g) || [];
        this.description = description;
    }
    OpCommand.prototype.option = function (flags, description) {
        var self = this;
        var option = new Option(flags, description);
        var oname = option.name();
        var name = this._camelcase(oname);
        var defaultValue;
        // preassign default value only for --no-*, [optional], or <required>
        if (option.bool === false || option.optional || option.required) {
            // when --no-* we make sure default is true
            if (option.bool === false) {
                defaultValue = true;
            }
            // preassign only if we have a default
            if (defaultValue !== undefined) {
                self[name] = defaultValue;
            }
        }
        // register the option
        this.options.push(option);
        // when it's passed assign the value
        // and conditionally invoke the callback
        // this.on(oname, function (val) {
        //   // unassigned or bool
        //   if (typeof self[name] === 'boolean' || typeof self[name] === 'undefined') {
        //     // if no value, bool true, and we have a default, then use it!
        //     if (val === null) {
        //       self[name] = option.bool ? defaultValue || true : false;
        //     } else {
        //       self[name] = val;
        //     }
        //   } else if (val !== null) {
        //     // reassign
        //     self[name] = val;
        //   }
        // });
        return this;
    };
    ;
    OpCommand.prototype.local = function () {
        this.isLocal = true;
        return this;
    };
    OpCommand.prototype.remote = function () {
        this.isLocal = false;
        return this;
    };
    OpCommand.prototype.action = function (callback) {
        this.callback = callback;
        return this;
    };
    OpCommand.prototype.getCommandTextExample = function () {
        var text = "";
        var positionalArguments = "";
        var options = "";
        text += this.name + " ";
        if (this.arguments) {
            for (var i = 0; i < this.arguments.length; i++) {
                positionalArguments += this.arguments[i].substr(1, this.arguments[i].length - 2) + " ";
            }
        }
        if (this.options) {
            for (var i = 0; i < this.options.length; i++) {
                var optSwitch = this.options[i].long;
                var optArg = this.options[i].flags.match(/[<|\[].*[>|\]]/g).join(" ").replace(/[<|>|\[|\]]/g, "");
                options += optSwitch + " " + optArg + " ";
            }
        }
        var final = text + positionalArguments + options;
        return final;
    };
    OpCommand.prototype._camelcase = function (flag) {
        return flag.split('-').reduce(function (str, word) {
            return str + word[0].toUpperCase() + word.slice(1);
        });
    };
    return OpCommand;
}());

var Option = /** @class */ (function () {
    function Option(flags, description) {
        this.flags = flags;
        this.required = ~flags.indexOf('<');
        this.optional = ~flags.indexOf('[');
        this.bool = !~flags.indexOf('-no-');
        // this.autocomplete = autocomplete;
        flags = flags.split(/[ ,|]+/);
        if (flags.length > 1 && !/^[[<]/.test(flags[1])) {
            this.assignFlag(flags.shift());
        }
        this.assignFlag(flags.shift());
        this.description = description || '';
    }
    Option.prototype.name = function () {
        if (this.long !== undefined) {
            return this.long.replace('--', '').replace('no-', '');
        }
        return this.short.replace('-', '');
    };
    Option.prototype.is = function (arg) {
        return arg === this.short || arg === this.long;
    };
    Option.prototype.assignFlag = function (flag) {
        if (flag.startsWith('--')) {
            this.long = flag;
        }
        else {
            this.short = flag;
        }
    };
    return Option;
}());



/***/ }),

/***/ "./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.component.scss":
/*!*********************************************************************************!*\
  !*** ./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.component.scss ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (":host {\n  display: block;\n  position: relative;\n  height: 100%;\n  font-family: \"IBM Plex Sans\";\n}\n\n#pageContainer {\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n}\n\n#topBar {\n  flex-grow: 1;\n  display: flex;\n  align-items: center;\n  position: relative;\n  padding: 10px;\n  border-bottom: dashed thin gray;\n}\n\n#pageContainer-across {\n  display: flex;\n  flex-direction: row;\n  height: 100vh;\n}\n\n#topBar-vertical {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  position: relative;\n  padding: 5px;\n  border-right: solid thin gray;\n}\n\n.button-container {\n  margin-left: 2px;\n  margin-right: 2px;\n}\n\n.button-container button {\n  --transition: color 0.2s;\n}\n\n.button-container button:hover {\n  color: purple;\n}\n\n.splitButton {\n  position: relative;\n}\n\n#splitContainer {\n  flex-grow: 2;\n  display: flex;\n  flex-wrap: nowrap;\n  width: 100%;\n  height: 100%;\n  font-family: \"IBM Plex Sans\";\n}\n\n.split {\n  display: flex;\n  width: 100%;\n  flex-grow: 2;\n  position: relative;\n  height: 100%;\n}\n\n.splitSeparator {\n  box-sizing: border-box;\n  background-color: black;\n  width: 5px;\n  height: 100%;\n  flex-grow: 0;\n  border-left: dashed thin gray;\n  cursor: ew-resize;\n}\n\n.splitSeparator:hover {\n  box-sizing: border-box;\n  width: 5px;\n  height: 100%;\n  flex-grow: 0;\n  border-left: dashed thin gray;\n  background-color: purple;\n}\n\n.separatorHeader {\n  position: relative;\n  padding-right: 10px;\n  text-align: right;\n  color: #000;\n  background: #fff;\n  display: flex;\n  justify-content: space-between;\n  height: 20px;\n  width: 100%;\n  cursor: pointer;\n}\n\n.separatorHeader ion-icon {\n  color: gray;\n}\n\n.separatorHeader .panelTitle {\n  padding-bottom: 3px;\n  left: 10px;\n  position: relative;\n  color: black;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.separatorHeader.active {\n  background: darkgray;\n}\n\n.separatorHeader.active .panelTitle {\n  color: white;\n}\n\n.separatorCloseIcon {\n  transition: color 0.5s;\n}\n\n.separatorCloseIcon:hover {\n  color: pink;\n}\n\n.fixed-content {\n  margin-bottom: 0px;\n}\n\n#divArea {\n  background: none;\n  border: none;\n}\n\n.commandOutputComponentsContainer {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  position: relative;\n  overflow: visible;\n}\n\n.outputContainer {\n  position: relative;\n  flex: auto;\n  overflow: visible;\n  border-bottom: solid thin black;\n  background: #fff;\n}\n\n.commandLineContainer {\n  position: relative;\n  height: 50px;\n  min-height: 50px;\n  flex-grow: 0;\n  padding: 5px;\n  font-family: \"IBM Plex Mono\", monospace;\n  z-index: 999;\n  background: #ffff;\n  border-top: solid thin gray;\n}\n\n.movingProxy {\n  position: absolute;\n  display: none;\n  border: dashed 5px mat-color(blue, 100);\n  height: 100%;\n  top: 0px;\n  left: 0px;\n  z-index: 1000;\n}\n\ndiv.mat-select-arrow {\n  color: pink;\n}\n\n.mat-select-label {\n  flex-grow: 2;\n  color: pink;\n  text-align: left;\n  padding-left: 10px;\n  padding-top: 3px;\n  white-space: nowrap;\n  font-size: 12px;\n  font-family: \"IBM Plex Mono\";\n  font-weight: bold;\n}\n\n.mat-select {\n  display: block;\n  margin-left: 15px;\n  width: 50px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3RzL3B1bHNlLWNsaS9zcmMvbGliL3B1bHNlLWNsaS5jb21wb25lbnQvcHVsc2UtY2xpLmNvbXBvbmVudC5zY3NzIiwicHJvamVjdHMvcHVsc2UtY2xpL3NyYy9saWIvX3ZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0VBQ0UsY0FBQTtFQUVBLGtCQUFBO0VBRUEsWUFBQTtFQUNBLDRCQUFBO0FBSkY7O0FBT0E7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxhQUFBO0FBSkY7O0FBTUE7RUFDRSxZQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0EsK0JBQUE7QUFIRjs7QUFPQTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGFBQUE7QUFKRjs7QUFRQTtFQUVFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxZQUFBO0VBQ0EsNkJBQUE7QUFORjs7QUFTQTtFQUNFLGdCQUFBO0VBQ0EsaUJBQUE7QUFORjs7QUFTQTtFQUNFLHdCQUFBO0FBTkY7O0FBUUE7RUFDRSxhQUFBO0FBTEY7O0FBU0E7RUFHRSxrQkFBQTtBQVJGOztBQWNBO0VBQ0UsWUFBQTtFQUNBLGFBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EsNEJBQUE7QUFYRjs7QUFjQTtFQUNFLGFBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUVBLGtCQUFBO0VBQ0EsWUFBQTtBQVpGOztBQWVBO0VBQ0Usc0JBQUE7RUFDQSx1QkFBQTtFQUNBLFVBQUE7RUFDQSxZQUFBO0VBRUEsWUFBQTtFQUNBLDZCQUFBO0VBQ0EsaUJBQUE7QUFiRjs7QUFlQTtFQUNFLHNCQUFBO0VBRUEsVUFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0EsNkJBQUE7RUFDQSx3QkNoRE87QURtQ1Q7O0FBZ0JBO0VBQ0Usa0JBQUE7RUFDQSxtQkFBQTtFQUNBLGlCQUFBO0VBRUEsV0M1RFc7RUQ2RFgsZ0JDNURXO0VENkRYLGFBQUE7RUFDQSw4QkFBQTtFQUNBLFlBQUE7RUFDQSxXQUFBO0VBQ0EsZUFBQTtBQWRGOztBQWdCQTtFQUNFLFdBQUE7QUFiRjs7QUFlQTtFQUVFLG1CQUFBO0VBQ0EsVUFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLHlCQUFBO0tBQUEsc0JBQUE7TUFBQSxxQkFBQTtVQUFBLGlCQUFBO0FBYkY7O0FBZ0JBO0VBQ0Usb0JDMUVxQjtBRDZEdkI7O0FBZ0JBO0VBQ0UsWUFBQTtBQWJGOztBQWdCQTtFQUNFLHNCQUFBO0FBYkY7O0FBZ0JBO0VBRUUsV0FBQTtBQWRGOztBQWlCQTtFQUNFLGtCQUFBO0FBZEY7O0FBaUJBO0VBQ0UsZ0JBQUE7RUFDQSxZQUFBO0FBZEY7O0FBa0JBO0VBQ0Usa0JBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFBa0IsaUJBQUE7QUFkcEI7O0FBaUJBO0VBQ0Usa0JBQUE7RUFDQSxVQUFBO0VBQ0EsaUJBQUE7RUFDQSwrQkFBQTtFQUVBLGdCQ3hIVztBRHlHYjs7QUF1QkE7RUFDRSxrQkFBQTtFQUVBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0EsdUNBQUE7RUFFQSxZQUFBO0VBQ0EsaUJDN0l5QjtFRCtJekIsMkJBQUE7QUF2QkY7O0FBMEJBO0VBQ0Usa0JBQUE7RUFDQSxhQUFBO0VBQ0EsdUNBQUE7RUFDQSxZQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSxhQUFBO0FBdkJGOztBQTBCQTtFQUNFLFdDdEpvQjtBRCtIdEI7O0FBMEJBO0VBQ0UsWUFBQTtFQUNBLFdDM0pvQjtFRDRKcEIsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsNEJBQUE7RUFDQSxpQkFBQTtBQXZCRjs7QUE2QkE7RUFDRSxjQUFBO0VBQ0EsaUJBQUE7RUFDQSxXQUFBO0FBMUJGIiwiZmlsZSI6InByb2plY3RzL3B1bHNlLWNsaS9zcmMvbGliL3B1bHNlLWNsaS5jb21wb25lbnQvcHVsc2UtY2xpLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCBcIi4uL192YXJpYWJsZXMuc2Nzc1wiO1xuXG5cbjpob3N0IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIFxuICBoZWlnaHQ6IDEwMCU7XG4gIGZvbnQtZmFtaWx5OiAnSUJNIFBsZXggU2Fucyc7XG59XG5cbiNwYWdlQ29udGFpbmVye1xuICBkaXNwbGF5OmZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOmNvbHVtbjtcbiAgaGVpZ2h0OjEwMHZoO1xufVxuI3RvcEJhciB7XG4gIGZsZXgtZ3JvdzoxO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczpjZW50ZXI7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZzoxMHB4O1xuICBib3JkZXItYm90dG9tOmRhc2hlZCB0aGluIGdyYXk7XG59XG5cbi8vcmVwbGFjZXMgcGFnZUNvbnRhaW5lclxuI3BhZ2VDb250YWluZXItYWNyb3Nze1xuICBkaXNwbGF5OmZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOnJvdztcbiAgaGVpZ2h0OjEwMHZoO1xufVxuXG4vL3JlcGxhY2VzIHRvcEJhclxuI3RvcEJhci12ZXJ0aWNhbHtcbiAgLy8gZmxleC1ncm93OjE7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOmNlbnRlcjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBwYWRkaW5nOjVweDtcbiAgYm9yZGVyLXJpZ2h0OnNvbGlkIHRoaW4gZ3JheTtcbn1cblxuLmJ1dHRvbi1jb250YWluZXJ7XG4gIG1hcmdpbi1sZWZ0OjJweDtcbiAgbWFyZ2luLXJpZ2h0OjJweDtcbn1cblxuLmJ1dHRvbi1jb250YWluZXIgYnV0dG9ue1xuICAtLXRyYW5zaXRpb246IGNvbG9yIDAuMnM7XG59XG4uYnV0dG9uLWNvbnRhaW5lciBidXR0b246aG92ZXJ7XG4gIGNvbG9yOiRhY2NlbnQ7XG59XG5cblxuLnNwbGl0QnV0dG9uIHtcblxuXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuXG5cblxuI3NwbGl0Q29udGFpbmVye1xuICBmbGV4LWdyb3c6MjtcbiAgZGlzcGxheTpmbGV4OyBcbiAgZmxleC13cmFwOm5vd3JhcDsgXG4gIHdpZHRoOjEwMCU7IFxuICBoZWlnaHQ6MTAwJTtcbiAgZm9udC1mYW1pbHk6ICdJQk0gUGxleCBTYW5zJ1xufVxuXG4uc3BsaXQge1xuICBkaXNwbGF5OiBmbGV4O1xuICB3aWR0aDogMTAwJTtcbiAgZmxleC1ncm93OiAyO1xuICAvLyBvdmVyZmxvdzpoaWRkZW47XG4gIHBvc2l0aW9uOnJlbGF0aXZlO1xuICBoZWlnaHQ6MTAwJTtcbn1cblxuLnNwbGl0U2VwYXJhdG9yIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XG4gIHdpZHRoOiA1cHg7XG4gIGhlaWdodDogMTAwJTtcbiAgXG4gIGZsZXgtZ3JvdzogMDtcbiAgYm9yZGVyLWxlZnQ6IGRhc2hlZCB0aGluIGdyYXk7XG4gIGN1cnNvcjogZXctcmVzaXplO1xufVxuLnNwbGl0U2VwYXJhdG9yOmhvdmVyIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgXG4gIHdpZHRoOiA1cHg7XG4gIGhlaWdodDogMTAwJTtcbiAgZmxleC1ncm93OiAwO1xuICBib3JkZXItbGVmdDogZGFzaGVkIHRoaW4gZ3JheTtcbiAgYmFja2dyb3VuZC1jb2xvcjokYWNjZW50O1xufVxuXG4uc2VwYXJhdG9ySGVhZGVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xuICB0ZXh0LWFsaWduOiByaWdodDtcbiAgXG4gIGNvbG9yOiRmb3JlZ3JvdW5kO1xuICBiYWNrZ3JvdW5kOiAkYmFja2dyb3VuZDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBoZWlnaHQ6IDIwcHg7XG4gIHdpZHRoOiAxMDAlO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG4uc2VwYXJhdG9ySGVhZGVyIGlvbi1pY29uIHtcbiAgY29sb3I6IGdyYXk7XG59XG4uc2VwYXJhdG9ySGVhZGVyIC5wYW5lbFRpdGxlIHtcbiAgXG4gIHBhZGRpbmctYm90dG9tOjNweDtcbiAgbGVmdDogMTBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBjb2xvcjpibGFjaztcbiAgdXNlci1zZWxlY3Q6bm9uZTtcbn1cblxuLnNlcGFyYXRvckhlYWRlci5hY3RpdmUge1xuICBiYWNrZ3JvdW5kOiAkcHJpbWFyeS1kYXJrLXZhcmlhbnQ7XG59XG5cbi5zZXBhcmF0b3JIZWFkZXIuYWN0aXZlIC5wYW5lbFRpdGxle1xuICBjb2xvcjp3aGl0ZTtcbn1cblxuLnNlcGFyYXRvckNsb3NlSWNvbiB7XG4gIHRyYW5zaXRpb246IGNvbG9yIDAuNXM7XG59XG5cbi5zZXBhcmF0b3JDbG9zZUljb246aG92ZXIge1xuICBcbiAgY29sb3I6IHBpbms7XG59XG5cbi5maXhlZC1jb250ZW50IHtcbiAgbWFyZ2luLWJvdHRvbTogMHB4O1xufVxuXG4jZGl2QXJlYSB7XG4gIGJhY2tncm91bmQ6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbn1cblxuXG4uY29tbWFuZE91dHB1dENvbXBvbmVudHNDb250YWluZXJ7XG4gIHBvc2l0aW9uOnJlbGF0aXZlO1xuICBkaXNwbGF5OmZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOmNvbHVtbjtcbiAgaGVpZ2h0OjEwMCU7XG4gIHBvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OnZpc2libGU7XG59XG5cbi5vdXRwdXRDb250YWluZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGZsZXg6YXV0bztcbiAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIGJvcmRlci1ib3R0b206IHNvbGlkIHRoaW4gYmxhY2s7XG4gIC8vIGhlaWdodDpjYWxjKDEwMCUgLSA1MHB4KTtcbiAgYmFja2dyb3VuZCA6ICRiYWNrZ3JvdW5kO1xufVxuXG5cbi8vIC5vdXRwdXRDb250YWluZXIgLnRha2VIZWlnaHRBd2F5e1xuLy8gICBoZWlnaHQ6Y2FsYygxMDAlIC0gNzBweCk7XG4vLyB9XG5cbi5jb21tYW5kTGluZUNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICBoZWlnaHQ6NTBweDtcbiAgbWluLWhlaWdodDo1MHB4O1xuICBmbGV4LWdyb3c6MDtcbiAgcGFkZGluZzogNXB4O1xuICBmb250LWZhbWlseTogJ0lCTSBQbGV4IE1vbm8nLCBtb25vc3BhY2U7XG5cbiAgei1pbmRleDogOTk5O1xuICBiYWNrZ3JvdW5kOiAkY29tbWFuZC1saW5lLWJhY2tncm91bmQ7XG5cbiAgYm9yZGVyLXRvcDogc29saWQgdGhpbiBncmF5O1xufVxuXG4ubW92aW5nUHJveHkge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGJvcmRlcjogZGFzaGVkIDVweCBtYXQtY29sb3IoJGFwcC1hY2NlbnQsMTAwKTtcbiAgaGVpZ2h0OjEwMCU7XG4gIHRvcDogMHB4O1xuICBsZWZ0OiAwcHg7XG4gIHotaW5kZXg6IDEwMDA7XG59XG5cbmRpdi5tYXQtc2VsZWN0LWFycm93e1xuICBjb2xvcjokYWNjZW50LWxpZ2h0LXZhcmlhbnQ7XG59XG5cbi5tYXQtc2VsZWN0LWxhYmVse1xuICBmbGV4LWdyb3c6MjtcbiAgY29sb3I6JGFjY2VudC1saWdodC12YXJpYW50O1xuICB0ZXh0LWFsaWduOmxlZnQ7XG4gIHBhZGRpbmctbGVmdDoxMHB4O1xuICBwYWRkaW5nLXRvcDozcHg7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIGZvbnQtc2l6ZToxMnB4O1xuICBmb250LWZhbWlseTonSUJNIFBsZXggTW9ubyc7XG4gIGZvbnQtd2VpZ2h0OmJvbGQ7XG4gIFxuIFxufVxuXG5cbi5tYXQtc2VsZWN0e1xuICBkaXNwbGF5OmJsb2NrO1xuICBtYXJnaW4tbGVmdDoxNXB4OyBcbiAgd2lkdGg6NTBweDtcbiAgLy8gYm9yZGVyLWxlZnQ6c29saWQgdGhpbiB3aGl0ZTtcbiAgLy8gYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LDAuMik7XG59XG5cbiIsIi8vIC8vIEltcG9ydCBtYXRlcmlhbCB0aGVtaW5nIGZ1bmN0aW9uc1xuLy8gLy8gQGltcG9ydCAnfkBhbmd1bGFyL21hdGVyaWFsL3RoZW1pbmcnO1xuXG4vLyAvLyBDb3B5IHRoZSBwYWxldHRlcyBmcm9tIHlvdXIgc2VsZWN0ZWQgdGhlbWUgKHVzdWFsbHkgdGhlbWUuc2NzcykuXG4vLyAkYXBwLXByaW1hcnk6IG1hdC1wYWxldHRlKCRtYXQtZ3JheSk7XG4vLyAkYXBwLXNlY29uZGFyeTptYXQtcGFsZXR0ZSgkbWF0LXB1cnBsZSk7XG4vLyAkYXBwLWFjY2VudDogIG1hdC1wYWxldHRlKCRtYXQtcGluayk7XG4vLyAkYXBwLXdhcm46ICAgIG1hdC1wYWxldHRlKCRtYXQtZGVlcC1vcmFuZ2UpO1xuLy8gJHRoZW1lOiBtYXQtbGlnaHQtdGhlbWUoJGFwcC1wcmltYXJ5LCRhcHAtYWNjZW50LCRhcHAtd2Fybik7XG4vLyAvLyBDcmVhdGUgeW91ciBTYXNzIGNvbG9yIHZhcnMgKHdpbGwgYmUgYXZhaWxhYmxlIGluIGFsbCB0aGUgcHJvamVjdClcblxuXG4vLyAkcHJpbWFyeTogbWF0LWNvbG9yKCRhcHAtcHJpbWFyeSwgNjAwKTtcbi8vICRwcmltYXJ5LWxpZ2h0LXZhcmlhbnQ6IG1hdC1jb2xvcigkYXBwLXByaW1hcnksIDIwMCk7XG4vLyAkcHJpbWFyeS1kYXJrLXZhcmlhbnQ6IG1hdC1jb2xvcigkYXBwLXByaW1hcnksIDgwMCk7XG5cbi8vICRzZWNvbmRhcnk6IG1hdC1jb2xvcigkYXBwLXNlY29uZGFyeSw1MDApO1xuLy8gJHNlY29uZGFyeS1saWdodC12YXJpYW50OiBtYXQtY29sb3IoJGFwcC1zZWNvbmRhcnksMjAwKTtcbi8vICRzZWNvbmRhcnktZGFyay12YXJpYW50OiBtYXQtY29sb3IoJGFwcC1zZWNvbmRhcnksNzAwKTtcblxuXG4vLyAkYWNjZW50OiBtYXQtY29sb3IoJGFwcC1hY2NlbnQpO1xuLy8gJGFjY2VudC1ob3ZlcjogbWF0LWNvbG9yKCRhcHAtd2FybiwgNTAwKTtcbi8vICRhY2NlbnQtbGlnaHQtdmFyaWFudDogbWF0LWNvbG9yKCRhcHAtYWNjZW50LDMwMCk7XG4vLyAkYWNjZW50LWRhcmstdmFyaWFudDogbWF0LWNvbG9yKCRhcHAtYWNjZW50LDcwMCk7XG5cblxuLy8gJHdhcm46IG1hdC1jb2xvcigkYXBwLXdhcm4pO1xuXG4vLyAkYmFja2dyb3VuZDogbWF0LWNvbG9yKG1hcC1nZXQoJHRoZW1lLCBiYWNrZ3JvdW5kKSk7XG4vLyAkZm9yZWdyb3VuZDogbWF0LWNvbG9yKG1hcC1nZXQoJHRoZW1lLCBmb3JlZ3JvdW5kKSk7XG5cblxuXG4vLyAkb3V0cHV0LWJvcmRlcjogbWF0LWNvbG9yKCRhcHAtcHJpbWFyeSwxMDApO1xuLy8gJG91dHB1dC1oZWFkZXItYmFja2dyb3VuZDogbWF0LWNvbG9yKCRhcHAtcHJpbWFyeSwxMDApO1xuLy8gJG91dHB1dC1oZWFkZXItZm9yZWdyb3VuZDogbWF0LWNvbG9yKCRhcHAtYWNjZW50LDcwMCk7XG4vLyAkb3V0cHV0LWhlYWRlci1ib3JkZXItYm90dG9tOm1hdC1jb2xvcigkYXBwLXByaW1hcnksMzAwKTtcblxuLy8gJG91dHB1dC1jb250ZW50LWJhY2tncm91bmQ6IHdoaXRlO1xuXG5cbi8vICRjb21tYW5kLWxpbmUtYmFja2dyb3VuZDogbWF0LWNvbG9yKCRhcHAtcHJpbWFyeSwxMDApO1xuLy8gJGNvbW1hbmQtbGluZS1mb3JlZ3JvdW5kOiAkb3V0cHV0LWhlYWRlci1mb3JlZ3JvdW5kO1xuXG5cbiRjb21tYW5kLWxpbmUtZm9yZWdyb3VuZCA6ICMwMDA7XG4kY29tbWFuZC1saW5lLWJhY2tncm91bmQgOiAjZmZmZjtcblxuJGZvcmVncm91bmQ6ICMwMDA7XG4kYmFja2dyb3VuZDogI2ZmZjtcblxuJGFwcC1hY2NlbnQ6Ymx1ZTtcbiRhY2NlbnQ6IHB1cnBsZTtcbiRhY2NlbnQtbGlnaHQtdmFyaWFudDpwaW5rO1xuXG4kcHJpbWFyeS1kYXJrLXZhcmlhbnQ6IGRhcmtncmF5O1xuXG4kb3V0cHV0LWhlYWRlci1iYWNrZ3JvdW5kOiBkYXJrZ3JlZW47XG4kb3V0cHV0LWhlYWRlci1mb3JlZ3JvdW5kOiB5ZWxsb3c7XG4kb3V0cHV0LWhlYWRlci1ib3JkZXItYm90dG9tOiBhcXVhOyJdfQ== */");

/***/ }),

/***/ "./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.component.ts":
/*!*******************************************************************************!*\
  !*** ./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.component.ts ***!
  \*******************************************************************************/
/*! exports provided: PulseCLIComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PulseCLIComponent", function() { return PulseCLIComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _command_output_component_command_output_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../command-output.component/command-output.component */ "./projects/pulse-cli/src/lib/command-output.component/command-output.component.ts");
/* harmony import */ var _command_line_component_command_line_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../command-line.component/command-line.component */ "./projects/pulse-cli/src/lib/command-line.component/command-line.component.ts");
/* harmony import */ var _command_registry_service_command_registry_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../command-registry.service/command-registry.service */ "./projects/pulse-cli/src/lib/command-registry.service/command-registry.service.ts");
/* harmony import */ var _pulse_cli_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../pulse-cli.service */ "./projects/pulse-cli/src/lib/pulse-cli.service.ts");






var PulseCLIComponent = /** @class */ (function () {
    function PulseCLIComponent(elementRef, componentFactoryResolver, renderer, injector, changeDetector, commandRegistry, global) {
        this.elementRef = elementRef;
        this.componentFactoryResolver = componentFactoryResolver;
        this.renderer = renderer;
        this.injector = injector;
        this.changeDetector = changeDetector;
        this.commandRegistry = commandRegistry;
        this.global = global;
        // @ViewChildren("matSelectForCommandHistories", { read: MatSelect }) matSelectForCommandHistories: QueryList<MatSelect>;
        this.activeTab = 0;
        this.splits = 1;
        this.splitWidthArr = new Array(this.splits);
        this.splitSeparatorArr = new Array(this.splits);
        //this two arrays hold lists of commandOutputComponents that correspond to each split  
        this.commandOutputComponentLists = [new Array()];
        this.commandComponentHistories = [new Array()];
        this.limitVisibleCommandOuputComponents = 3;
        this.limitAvailableCommandComponentHistories = 10;
        this.hiddenCommandComponents = [new Array()];
        this.commandOutputHeaderMouseDown = false;
        this.createdComponentsCounter = 0;
        // public executeSocketCommand(commandString) {
        //   let command = commandString + ` -r ${this.global.researcher_email}`;
        //   this.SocketService.socket.emit("exec_command", command);
        // }
        // public executeLocalCommand(commandString) {
        //   //let command = new OpCommand(commandString);
        // }
        this.indexOfSeparatorMouseDown = null;
        this.startMovingCommandOutput = false;
        this.startMovingCommandOutputStartX = 0;
        this.startMovingCommandOutputStartY = 0;
        this.startMovingCommandOutputMovementX = 0;
        this.startMovingCommandOutputMovementY = 0;
        this.splitBoundingClientRects = [];
        this.commandOutputNativeElementToMoveAround = null;
        this.headerDragX = 0;
        this.headerDragY = 0;
        this.dropped = false;
        this.localCommands = [
            "?",
            "create document"
        ];
        window.f = this;
        for (var i = 0; i < this.splits; i++) {
            this.splitSeparatorArr[i] = {};
            this.splitWidthArr[i] = 100 / this.splits;
        }
        // this.SocketService.socket.on('exec_result', (data) => {
        //   //create objectList from result;
        //   this.addObjectListForResult(data);
        // })
    }
    PulseCLIComponent.prototype.recalcSplitWidths = function () {
        this.splitWidthArr = [];
        for (var i = 0; i < this.splits; i++) {
            this.splitWidthArr.push(100 / this.splits);
        }
    };
    PulseCLIComponent.prototype.newSplit = function () {
        this.splits++;
        this.splitSeparatorArr.push({});
        this.recalcSplitWidths();
        this.commandOutputComponentLists.push(new Array());
        this.commandComponentHistories.push(new Array());
        this.hiddenCommandComponents.push(new Array());
        this.activeTab = this.splits - 1;
    };
    PulseCLIComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("ngOnInit");
        this.registerUICommands();
        // this.registerCommands()
        setTimeout(function () {
            // this.socketServiceObserver = this.SocketService.allEventsSubject.subscribe((data) => {
            //TODO::
            // let index = this.SocketService.eventList.indexOf(data);
            // console.log(data);
            // this.snackBar.open("hey", "ok", {
            //   duration: 2000,
            // });
            // })
            // this.commandRegistry.parseCommand("what now");
            // this.commandRegistry.executeStartupCommands();
            _this.global.UI.cli.push(_this);
            setTimeout(function () {
                _this.commandLine._results[_this.activeTab].setFocusToCommandLine();
            }, 500);
        }, 500);
        if (this.outputContainerChildren)
            this.outputContainerHeight = parseInt(window.getComputedStyle(this.outputContainerChildren.toArray()[this.activeTab].element.nativeElement).height);
        window.addEventListener("resize", function (event) {
            var a = _this;
            var newHeight = 100;
            if (_this.outputContainerChildren) {
                newHeight = parseInt(window.getComputedStyle(_this.outputContainerChildren.toArray()[_this.activeTab].element.nativeElement).height);
            }
            var diff = newHeight - _this.outputContainerHeight;
            _this.outputContainerHeight = newHeight;
            for (var i = 0; i < _this.commandOutputComponentLists.length; i++) {
                var list = _this.commandOutputComponentLists[i];
                for (var j = 0; j < list.length; j++) {
                    var item = _this.commandOutputComponentLists[i][j];
                    var itemHeight = parseInt(window.getComputedStyle(item.instance.element.nativeElement).height);
                    var newHeight_1 = itemHeight + diff + "px";
                    _this.renderer.setStyle(item.instance.element.nativeElement, "height", newHeight_1);
                }
            }
        });
    };
    PulseCLIComponent.prototype.ngAfterViewInit = function () {
    };
    PulseCLIComponent.prototype.registerUICommands = function () {
        var _this = this;
        this.commandRegistry.registerCallbackWhenCommmandDoesNotExist(function (args) {
            var cmdContainerInstance = _this.insertComponent().cmdContainer;
            cmdContainerInstance.placeInContainer(args.commandName + ": <span style=\"color:orange\">no such command<span>");
            cmdContainerInstance.hideCommand();
            _this.clearActiveCommandLine();
        });
        this.commandRegistry.command('panel <number>', "make numbered panel active or add new panel to screen", "UI")
            .action(function (args, commandString, resolve, reject) {
            _this.clearActiveCommandLine();
            if (!args.number) {
                _this.newSplit();
            }
            else if (args.number <= _this.splits) {
                //choose the panel
                _this.activeTab = args.number - 1;
            }
            _this.changeDetector.detectChanges();
            resolve(_this);
        });
    };
    PulseCLIComponent.prototype.registerCommands = function () {
        var _this = this;
        this.commandRegistry.registerCallbackWhenCommmandDoesNotExist(function (args) {
            var cmdContainerInstance = _this.insertComponent().cmdContainer;
            cmdContainerInstance.placeInContainer(args.commandName + ": <span style=\"color:orange\">no such command<span>");
            cmdContainerInstance.hideCommand();
            _this.clearActiveCommandLine();
        });
        // this.commandRegistry.command("help", "this help text", "help")
        //   .action((args, commandString, resolve, reject) => {
        //     let cmdContainer = this.insertComponent(null, 'help').cmdContainer;
        //     for (var i = 0; i < args.helpItems.length; i++) {
        //       cmdContainer.container.insert(args.helpItems[i].hostView);
        //     }
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   })
        // this.commandRegistry.command("echo <text>", "print html into the output", "unlisted")
        //   .action((args, commandString, resolve, reject) => {
        //     this.echo(args.text)
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   })
        // this.commandRegistry.command("list participants", "get a list of participants", "participants")
        //   .remote()
        //   .action((args, commandString, resolve, reject) => {
        //     let cmdContainer = this.insertComponent(ParticipantList2Component, commandString).cmdContainer;
        //     cmdContainer.commandString = commandString;
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   })
        // this.commandRegistry.command("create participant <email> <password>", "create a participant with an email and a password", "participants")
        //   .remote()
        //   .action((args, commandString, resolve, reject) => {
        //     let doCreateParticipant = (email, password) => {
        //       this.participantSource.create({ email, password }).then((participant) => {
        //         this.clearActiveCommandLine();
        //         this.participantSource.fetch();
        //         resolve({ email, password });
        //       }).catch((error) => {
        //         console.error(error);
        //         this.echo(this.red(error.error));
        //         reject(error);
        //       })
        //     }
        //     if ((args.email) && (args.password)) {
        //       doCreateParticipant(args.email, args.password)
        //     } else {
        //       this.alertCtrl.create({
        //         header: 'Create participant',
        //         message: 'Enter email and password for new participant',
        //         inputs: [{
        //           name: 'email',
        //           placeholder: 'email'
        //         }, {
        //           name: 'password',
        //           type: 'password',
        //           placeholder: 'password'
        //         }],
        //         buttons: [
        //           { text: "cancel" },
        //           {
        //             text: 'ok',
        //             handler: data => {
        //               doCreateParticipant(data.email, data.password);
        //             }
        //           },
        //         ],
        //       }).then(c => {
        //         c.present().then((d) => {
        //           // console.log(d);
        //           // console.log(c);
        //         });
        //       });
        //     }
        //   })
        // this.commandRegistry.command("open participant <email>", "show details of paricipant", "participants")
        //   .action((args, commandString, resolve, reject) => {
        //     this.participantSource.fetchSingle({ email: args.email }).then((result: any) => {
        //       let components = this.insertComponent(ParticipantEditorComponent, commandString);
        //       components.cmdContainer.commandString = commandString;
        //       let participantEditor = components.component;
        //       participantEditor.setConfig(result);
        //       this.clearActiveCommandLine()
        //       resolve(this);
        //     }).catch(error => {
        //       this.echo(error);
        //       reject(error);
        //     })
        //     this.clearActiveCommandLine()
        //   });
        // this.commandRegistry.command("remove participants", "removes participants from listings.", "participants")
        //   .option('-p, --participants [participants]', "a set of participants to delete, wrapped in quotes. e.g. 'p1,p2,p3'")
        //   .option('-y, --yes', "don't ask for confirmation")
        //   .action((args, commandString, resolve, reject) => {
        //     let doDeleteParticipants = (participants) => {
        //       this.global.deleteParticipants(participants).then((result) => {
        //         resolve(this);
        //       }).catch(error => {
        //         reject(error);
        //       })
        //     }
        //     if (!args.options.yes) {
        //       //delete participants alert
        //       this.alertCtrl.create({
        //         header: `Warning!`,
        //         message: `Removing participants will remove them from groups and participant lists, but users will remain within the system. Proceed?`,
        //         buttons: [{ text: "yes", handler: () => { doDeleteParticipants(args.options.participants) } }, 'no']
        //       }).then(c => c.present());
        //     }
        //     this.clearActiveCommandLine()
        //   })
        // this.commandRegistry.command('usageStatistics <participant>', 'show usage statistics for participant', 'participants')
        //   .option('-s, --start [startDateTime]', "start date for data set")
        //   .option('-e, --end [endDateTime]', "end date for data set")
        //   .action((args, commandString, resolve, reject) => {
        //     let components = this.insertComponent(UsageStatisticsComponent, commandString);
        //     components.cmdContainer.commandString = commandString;
        //     let usageStatisticsComponent = components.component;
        //     if (!args.options.startDateTime) {
        //       args.options.startDateTime = [0];
        //     }
        //     if (!args.options.endDateTime) {
        //       args.options.endDateTime = [0];
        //     }
        //     usageStatisticsComponent.refresh({ startDateTime: args.options.startDateTime[0], endDateTime: args.options.endDateTime[0], participant: args.participant })
        //   })
        // this.commandRegistry.command("list groups", "get a list of groups", "groups")
        //   .remote()
        //   .action((args, commandString, resolve, reject) => {
        //     let components = this.insertComponent(GroupList2Component, commandString);
        //     components.cmdContainer.commandString = commandString;
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   })
        // this.commandRegistry.command("delete groups", "delete groups from database", "groups")
        //   .option('-g, --groups [groups]', "group to delete")
        //   .option('-y, --yes', "don't ask for confirmation")
        //   .action((args, commandString, resolve, reject) => {
        //     let doDeleteGroups = (groups) => {
        //       this.global.deleteGroups(groups).then((result) => {
        //         resolve(this);
        //       })
        //     }
        //     if (!args.options.yes) {
        //       //delete participants alert
        //       this.alertCtrl.create({
        //         header: `Warning!`,
        //         message: `Deleting groups will also cause allocation rules to be dissassociated from respective members.
        //       Proceed?`,
        //         buttons: [{ text: "yes", handler: () => { doDeleteGroups(args.options.groups) } }, 'no']
        //       }).then(c => c.present());
        //     }
        //     this.clearActiveCommandLine()
        //   })
        // this.commandRegistry.command("create group <name>", "create a group", "groups")
        //   .option('-p, --participants [participants]', "a set of participants to include in the group, wrapped in quotes. e.g. 'p1,p2,p3'")
        //   .option('-n, --name <name>', 'the group\'s name')
        //   .remote()
        //   .action((args, commandString, resolve, reject) => {
        //     let doCreateGroup = (name, participants) => {
        //       this.clearActiveCommandLine()
        //       return this.groupSource.create({ name, participants }).then(result => {
        //         resolve({ name });
        //       }).catch((error) => {
        //         // console.error(error);
        //         this.alertCtrl.create({ header: error.error, buttons: ["ok"] })
        //         // this.echo(this.red(error.error));
        //         reject(error);
        //       })
        //     }
        //     let name = args.name || args.options.name
        //     if (!name) {
        //       console.log('group is missing');
        //       this.alertCtrl.create({
        //         header: 'Enter name for group',
        //         inputs: [{
        //           name: 'groupname',
        //           placeholder: 'group name'
        //         }],
        //         buttons: [{
        //           text: 'Continue',
        //           handler: data => {
        //             doCreateGroup(data.groupname, args.options.participants).then((result) => {
        //               // this.commandRegistry.parseCommand(`open group ${name}`);
        //             });
        //           }
        //         }]
        //       }).then(c => {
        //         c.present().then((d) => {
        //           //console.log(d);
        //           //console.log(c);
        //           setTimeout(() => {
        //             // c.childNodes[1].childNodes[2].childNodes[0].blur()
        //             //console.log(c.childNodes[1].childNodes[2].childNodes[0]);
        //             let d: any = c.childNodes[1].childNodes[2].childNodes[0].childNodes[0];
        //             d.focus();
        //           }, 100)
        //         });
        //       });
        //       return;
        //     }
        //     else {
        //       doCreateGroup(name, args.options.participants);
        //     }
        //   })
        // this.commandRegistry.command("open group <name>", "edit a group", "groups")
        //   .action((args, commandString, resolve, reject) => {
        //     if (!this.groupSource.itemsByIndex[args.name]) {
        //       this.groupSource.fetchSingle({ name: args.name }).then((result: any) => {
        //         let components = this.insertComponent(GroupEditor2Component, commandString);
        //         components.cmdContainer.commandString = commandString;
        //         let groupEditor = components.component;
        //         groupEditor.setConfig(result);
        //         resolve(this);
        //       }).catch(error => {
        //         reject(error);
        //       })
        //     }
        //     else {
        //       let components = this.insertComponent(GroupEditor2Component, commandString);
        //       components.cmdContainer.commandString = commandString;
        //       let groupEditor = components.component;
        //       groupEditor.setConfig(this.groupSource.itemsByIndex[args.name]);
        //       resolve(this);
        //     }
        //     this.clearActiveCommandLine()
        //   });
        // this.commandRegistry.command('group participants', 'assign multiple participants to a group', "groups")
        //   .option('-g, --group <group>', 'existing or new group to place participant(s) in')
        //   .option('-p, --participant <participant>', 'participant(s) to place in group')
        //   .action((args, commandString, resolve, reject) => {
        //     let doΑddToGroup = (name: string, participants: any) => {
        //       this.global.addToGroup(name, participants).then(result => {
        //         resolve(this);
        //       }).catch(error => {
        //         console.log(error);
        //         reject(error);
        //       })
        //       this.clearActiveCommandLine()
        //     }
        //     let chooseGroupAlert = (grouplist) => {
        //       return this.alertCtrl.create({
        //         header: 'Select group',
        //         inputs: grouplist,
        //         buttons: [{
        //           text: 'Continue',
        //           handler: (name) => {
        //             doΑddToGroup(name, args.options.participants);
        //           }
        //         }]
        //       });
        //     }
        //     let name = args.name || args.options.name
        //     if (!name) {
        //       this.global.fetchGroups().then((groups: any) => {
        //         //create the group list
        //         let groupList = [];
        //         for (var i = 0; i < groups.length; i++) {
        //           groupList.push({ label: groups[i].name, value: groups[i].name, type: "radio" })
        //         }
        //         chooseGroupAlert(groupList).then(c => c.present());
        //       }).catch((error) => {
        //         console.error(error);
        //         reject(error);
        //       })
        //     } else {
        //       doΑddToGroup(name, args.options.participants);
        //     }
        //   })
        // this.commandRegistry.command("list documents", "get a list of documents", "documents")
        //   .action((args, commandString, resolve, reject) => {
        //     let components = this.insertComponent(DocumentList2Component, commandString);
        //     components.cmdContainer.commandString = commandString;
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   })
        // this.commandRegistry.command("create document <name>", 'open up an editor for document creation', "documents")
        //   .action((args, commandString, resolve, reject) => {
        //     let containerAndComponentPair = this.insertComponent(DocumentEditorComponent, commandString);
        //     containerAndComponentPair.cmdContainer.commandString = commandString;
        //     let docEd = containerAndComponentPair.component;
        //     docEd.name = args.name;
        //     containerAndComponentPair.cmdContainer.commandString = commandString;
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   });
        // this.commandRegistry.command("open document <name>", 'open up an editor for document creation', "documents")
        //   .action((args, commandString, resolve, reject) => {
        //     if (!args.name) {
        //       this.echo(this.white(commandString) + this.red("document name is missing"));
        //       resolve(this);
        //       return;
        //     }
        //     this.documentSource.fetchSingle({ name: args.name }).then((result: any) => {
        //       let doc = result || { name: args.name };
        //       // let components = this.insertComponent(DocumentEditorComponent, commandString);
        //       let components = this.insertComponent(EditorComponent, commandString);
        //       components.cmdContainer.commandString = commandString;
        //       let docEd = components.component;
        //       setTimeout(()=>{
        //         docEd.setConfig(doc);
        //       });
        //       this.clearActiveCommandLine()
        //       resolve(this);
        //     }).catch(error => {
        //       this.echo(this.red(`document ${args.name} does not exist`));
        //       reject(error);
        //     });
        //   })
        // this.commandRegistry.command("preview document <name>", 'preview a document', "documents")
        //   .option('-u, --uuid <uuid>', 'uuid for document editor reference')
        //   .action((args, commandString, resolve, reject) => {
        //     if (!args.name) {
        //       if (args.options.uuid) {
        //         let components = this.insertComponent(PreviewComponent, commandString);
        //         // components.cmdContainer.commandString = commandString;
        //         let preview = components.component;
        //         let cmdContainer = components.cmdContainer;
        //         cmdContainer.commandString = commandString;
        //         this.clearActiveCommandLine()
        //         resolve(this);
        //         return;
        //       } else {
        //         this.echo(this.white(commandString) + this.red("document name is missing"));
        //         resolve(this);
        //         return;
        //       }
        //     } else {
        //       this.documentSource.fetchSingle({ name: args.name }).then((result: any) => {
        //         let components = this.insertComponent(PreviewComponent, commandString);
        //         components.cmdContainer.commandString = commandString;
        //         let preview = components.component;
        //         preview.setConfig(result);
        //         setTimeout(() => {
        //           preview.content = result.content;
        //         }, 100)
        //         let cmdContainer = components.cmdContainer;
        //         cmdContainer.commandString = commandString;
        //         this.clearActiveCommandLine()
        //         resolve(this);
        //       }).catch(error => {
        //         console.error(error);
        //         this.echo(this.red(`document ${args.name} does not exist`));
        //         reject(error);
        //       });
        //     }
        //   })
        // this.commandRegistry.command("import document", "import a document into the database", "documents")
        //   .option('-n, --name <name>', 'name for the document')
        //   .option("-s, --string <string>", "the document content provided as a string")
        //   .option("-d, --description_short", "short description")
        //   .option("-D, --description_long", "long description")
        //   .option("-id, --databaseId <databaseId>", 'will ovewrite existing document with id without confirmation')
        //     .action((args, commandString, resolve, reject) => {
        //       if ((!args.options.name) || (args.options.name === true)) {
        //         this.echo(this.white(commandString + ": import") + this.red("document name is missing"));
        //         resolve(this);
        //         return;
        //       }
        //       this.documentSource.apiSave({ name: args.options.name, content: args.options.string, description_long: args.options.description_long, description_short: args.options.description_short }).then((result: any) => {
        //         debugger;
        //         if (args.editorRef) {
        //           args.editorRef.databaseId = result.id;
        //         }
        //         resolve(this);
        //       }).catch(errorResponse => {
        //         if (errorResponse.error) {
        //           if (errorResponse.error.existingDoc) {
        //             // this.showModalWindow("document with name ${args.name")
        //             let overwriteAlert = this.alertCtrl.create({
        //               header: `Document ${args.options.name} already exists. Overwrite?`,
        //               buttons: [
        //                 {
        //                   text: "yes",
        //                   handler: () => {
        //                     let d = { name: args.options.name, content: args.options.string, description_long: args.options.description_long, description_short: args.options.description_short, id: errorResponse.error.existingDoc.id };
        //                     this.documentSource.apiUpdate(d).then(result => {
        //                       resolve(this);
        //                     }).catch(secondError => {
        //                       console.error(secondError);
        //                       reject(secondError);
        //                     })
        //                   }
        //                 }, 'no']
        //             })
        //             overwriteAlert.then(c => c.present());
        //           } else {
        //             reject(errorResponse.error);
        //           }
        //         }
        //         console.error(errorResponse);
        //       });
        //       this.clearActiveCommandLine()
        //     });
        // this.commandRegistry.command("delete documents", "delete documents from database", "documents")
        //   .option('-d, --documents [documents]', "documents to delete")
        //   .option('-y, --yes', "don't ask for confirmation")
        //   .action((args, commandString, resolve, reject) => {
        //     let doDeleteDocuments = (documents) => {
        //       this.global.document.delete(documents).then((result) => {
        //         //TODO: give some event indication
        //         resolve(this);
        //       }).catch(error => {
        //         reject(error);
        //       })
        //     }
        //     if (!args.options.yes) {
        //       //delete documents alert
        //       this.alertCtrl.create({
        //         header: `Warning!`,
        //         message: `About to delete document${args.options.documents.length - 1 ? 's' : ''} '${args.options.documents.toString()}'. Proceed?`,
        //         buttons: [
        //           {
        //             text: "yes",
        //             handler: () => {
        //               doDeleteDocuments(args.options.documents)
        //             }
        //           }, 'no']
        //       }).then(c => c.present());
        //     }
        //     else {
        //     }
        //     this.clearActiveCommandLine()
        //   })
        // this.commandRegistry.command('editor', 'bring up editor JS', 'documents')
        //   .action((args, commandString, resolve, reject) => {
        //     this.clearActiveCommandLine();
        //     let components = this.insertComponent(EditorComponent, commandString);
        //     let editor = components.component;
        //     components.cmdContainer.commandString = commandString;
        //     resolve(this);
        //   })
        // this.commandRegistry.command("create rule <name>", 'create a new  rule', "allocation rules")
        //   .option('-r, --rule <rule>', 'json for rule content')
        //   .option('-t, --type <type>', 'type of rule')
        //   .action((args, commandString, resolve, reject) => {
        //     let type;
        //     if (Array.isArray(args.options.type)) { type = args.options.type[0] } else { type = args.options.type }
        //     let rule;
        //     if (Array.isArray(args.options.rule)) { rule = args.options.rule[0] } else { rule = args.options.rule }
        //     if (!rule) {
        //       let components = this.insertComponent(RuleEditorComponent, commandString);
        //       components.cmdContainer.commandString = commandString;
        //       let ruleEditor = components.component;
        //       ruleEditor.setConfig({
        //         name: args.name,
        //         rule: rule,
        //         type: type
        //       })
        //       this.clearActiveCommandLine()
        //       resolve(ruleEditor);
        //     } else {
        //       //save it!
        //       this.ruleSource.create({
        //         name: args.name,
        //         rule: rule,
        //         type: type
        //       }).then((result) => {
        //         // this.alertCtrl.create({
        //         //   header: `Rule ${args.name} saved succcessfully`,
        //         //   buttons: ["ok"]
        //         // }).then(a => a.present());
        //         resolve(result);
        //       }).catch((error) => {
        //         let errorMessage = "";
        //         let errorHeader = `Error saving rule ${args.name}`;
        //         if (typeof (error) == "object") {
        //           if (error.error.code == "23505") {
        //             errorHeader = `rule ${args.name} already exists`;
        //             errorMessage = ""
        //           }
        //           error = JSON.stringify(error)
        //         };
        //         this.alertCtrl.create({
        //           header: errorHeader,
        //           message: errorMessage,
        //           buttons: ["ok"]
        //         }).then(a => a.present());
        //         reject(error);
        //       })
        //     }
        //   });
        // this.commandRegistry.command("list rules", "get a list of rules", "allocation rules")
        //   .remote()
        //   .action((args, commandString, resolve, reject) => {
        //     let components = this.insertComponent(RuleList2Component, commandString);
        //     components.cmdContainer.commandString = commandString;
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   })
        // this.commandRegistry.command("open rule <name>", "edit the configuration of an allocation rule", "allocation rules")
        //   .action((args, commandString, resolve, reject) => {
        //     if (!args.name) {
        //       let components = this.insertComponent(RuleEditorComponent, commandString);
        //       components.cmdContainer.commandString = commandString;
        //       let ruleEditor = components.component;
        //       resolve(this);
        //     } else
        //       if (!this.global.allocationrulesByName[args.name]) {
        //         this.ruleSource.fetchSingle({ name: args.name }).then((result: any) => {
        //           let components = this.insertComponent(RuleEditorComponent, commandString);
        //           components.cmdContainer.commandString = commandString;
        //           let ruleEditor = components.component;
        //           ruleEditor.setConfig(result);
        //           resolve(this);
        //         }).catch(error => {
        //           console.error(error);
        //           // this.echo(error);
        //           this.alertCtrl.create({
        //             header: `Rule ${args.name} does not exist`,
        //             message: 'Would you like to create it?',
        //             buttons: [
        //               {
        //                 text: "create",
        //                 handler: () => {
        //                   resolve(this.commandRegistry.parseCommand(`create rule ${args.name}`));
        //                 }
        //               },
        //               {
        //                 text: "cancel",
        //                 handler: () => {
        //                   resolve(this);
        //                 }
        //               }]
        //           }).then(a => a.present());
        //         });
        //       } else {
        //         let components = this.insertComponent(RuleEditorComponent, commandString);
        //         components.cmdContainer.commandString = commandString;
        //         let ruleEditor = components.component;
        //         ruleEditor.setConfig(this.global.allocationrulesByName[args.name]);
        //         resolve(this);
        //       }
        //     this.clearActiveCommandLine()
        //   });
        // this.commandRegistry.command("delete rule <name>", "delete one or more rules", "allocation rules")
        //   .option('-r, --rule <rulename>', "name of rule to be deleted")
        //   .action((args, commandString, resolve, reject) => {
        //     this.alertCtrl.create({
        //       header: `Warning`,
        //       message: 'Deleting rules removes associated allocations',
        //       buttons: [
        //         {
        //           text: "cancel",
        //           handler: () => {
        //             resolve(this);
        //           }
        //         },
        //         {
        //           text: "ok",
        //           handler: () => {
        //             let rulenames = args.options.rule || [];
        //             if (args.name) rulenames.push(args.name)
        //             this.ruleSource.delete(rulenames).then(result => {
        //               resolve(this);
        //             }).catch(error => {
        //               console.error(error);
        //             })
        //           }
        //         }]
        //     }).then(a => a.present());
        //   })
        // this.commandRegistry.command("list allocations", "get a list of allocations", "allocation rules")
        //   .remote()
        //   .action((args, commandString, resolve, reject) => {
        //     let components = this.insertComponent(AllocationList2Component, commandString);
        //     components.cmdContainer.commandString = commandString;
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   })
        // this.commandRegistry.command("create allocation <allocationName>", 'pair a participant or group with a document via a rule', "allocation rules")
        //   .option('-p, --participant <participant>', 'participant to apply the rule to')
        //   .option('-g, --group <group>', 'group to apply the rule to')
        //   .option('-d, --document <document>', 'document to apply the rule to')
        //   .option('-r, --rule <name>', 'json for rule content')
        //   .action((args, commandString, resolve, reject) => {
        //     let components = this.insertComponent(AllocationComposerComponent, commandString);
        //     components.cmdContainer.commandString = commandString;
        //     let allocationComposer = components.component;
        //     let document_name = args.options.document ? args.options.document[0] : null;
        //     let rule_name = args.options.rule ? args.options.rule[0] : null;
        //     allocationComposer.setConfig({
        //       participants: args.options.participant || [],
        //       groups: args.options.group || [],
        //       document_name: document_name,
        //       rule_name: rule_name,
        //       name: args.name,
        //     })
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   });
        // this.commandRegistry.command("open allocation <name>", "edit the configuration of an allocation rule", "allocation rules")
        //   .action((args, commandString, resolve, reject) => {
        //     if (!args.name) {
        //       let components = this.insertComponent(AllocationComposerComponent, commandString);
        //       components.cmdContainer.commandString = commandString;
        //       let ruleEditor = components.component;
        //       resolve(this);
        //     } else
        //       if (!this.allocationSource.itemsByIndex[args.name]) {
        //         this.allocationSource.fetchSingle({ name: args.name }).then((result: any) => {
        //           let components = this.insertComponent(AllocationComposerComponent, commandString);
        //           components.cmdContainer.commandString = commandString;
        //           let allocationComposer = components.component;
        //           allocationComposer.setConfig(result);
        //           resolve(this);
        //         }).catch(error => {
        //           console.error(error);
        //           this.alertCtrl.create({
        //             header: `Allocation rule ${args.name} does not exist`,
        //             message: 'Would you like to create it?',
        //             buttons: [
        //               {
        //                 text: "create",
        //                 handler: () => {
        //                   resolve(this.commandRegistry.parseCommand(`create allocation ${args.name}`));
        //                 }
        //               },
        //               {
        //                 text: "cancel",
        //                 handler: () => {
        //                   resolve(this);
        //                 }
        //               }]
        //           }).then(a => a.present());
        //         });
        //       } else {
        //         let components = this.insertComponent(AllocationComposerComponent, commandString);
        //         components.cmdContainer.commandString = commandString;
        //         let allocationComposer = components.component;
        //         allocationComposer.setConfig(this.allocationSource.itemsByIndex[args.name]);
        //         resolve(this);
        //       }
        //     this.clearActiveCommandLine()
        //   });
        // this.commandRegistry.command('send cloudmessage', "send a cloudmessage", "cloudmessages")
        //   .option('-i, --id <messageid>', 'when multiple participants are specified for the same message, the messageid is an indicator that all sent messages are of the same content. When a messageid is not provided, a messageid is generated.')
        //   .option('-t, --type <messagetype>', 'type of message, notification or data. Default is notification. WebApps can only receive \'data\' when running in the background, in order to display notifications')
        //   .option('-o, --origin <origin>', 'indicate where the message originated from')
        //   .option('-h, --title <title>', 'title for notification')
        //   .option('-b, --body <body>', 'text of notification')
        //   .option('-k, --key <key>', 'key for data payload. key "openDocument" with document id for value will cause client to open document')
        //   .option('-v, --value <value>', 'value for data payload')
        //   .option('-j, --payload <jsonstring>', 'provide cloudmessage properties as JSON string')
        //   .option('-g, --groups <groups>', 'group to send the notification to')
        //   .option('-p, --participants <participants>', 'participant to send the notification to')
        //   .action((args, commandString, resolve, reject) => {
        //     let messageid, type, origin, title, body, key, value, payload, groups, participants;
        //     if (Array.isArray(args.options.messageid)) { messageid = args.options.messageid[0]; } else { messageid = args.options.messageid }
        //     if (Array.isArray(args.options.type)) { type = args.options.type[0]; } else { type = args.options.type; }
        //     if (Array.isArray(args.options.origin)) { type = args.options.origin[0]; } else { origin = args.options.origin; }
        //     if (Array.isArray(args.options.title)) { title = args.options.title[0]; } else { title = args.options.title; }
        //     if (Array.isArray(args.options.body)) { body = args.options.body[0]; } else { body = args.options.body; }
        //     if (Array.isArray(args.options.payload)) { payload = args.options.payload[0] || {}; } else { payload = args.options.payload || {}; }
        //     participants = args.options.participants || [];
        //     groups = args.options.groups || [];
        //     if ((args.options.participants.length == 0) && (args.options.groups.length == 0)) {
        //       this.alertCtrl.create({
        //         header: "No recepients chosen",
        //         message: "You have chosen no participants or groups to send to",
        //         buttons: ["ok"]
        //       }).then(c => c.present());
        //       resolve();
        //       return;
        //     }
        //     // figure out the payload
        //     key = args.options.key || [];
        //     value = args.options.value || [];
        //     messageid = messageid || ["cloudmsg_at_" + new Date().getTime()];
        //     let cloudMessage = new Cloudmessage();
        //     cloudMessage.set({
        //       messageid, type, origin, title, body, key, value, payload, groups, participants
        //     })
        //     let keyValues = Object.assign({}, payload.data || {})
        //     for (let i = 0; i < key.length; i++) {
        //       keyValues[key[i]] = value[i] || null;
        //     }
        //     if (type == "dataNotification") {
        //       if (title) {
        //         keyValues["title"] = title;
        //       }
        //       if (body) {
        //         keyValues["body"] = body;
        //       }
        //     }
        //     cloudMessage.payload["data"] = keyValues;
        //     let sendCloudmessage = () => {
        //       this.cloudmessageSource.send(cloudMessage.get()).then((result: any) => {
        //         let firebaseSuccess = [];
        //         let firebaseError = [];
        //         let firebaseSuccessString = "";
        //         let firebaseErrorString = "";
        //         for (let i = 0; i < result.length; i++) {
        //           if (result[i].success) {
        //             firebaseSuccess.push(result[i])
        //             firebaseSuccessString += " " + result[i].participant;
        //           }
        //           if (result[i].error) {
        //             firebaseError.push(result[i]);
        //             firebaseErrorString += " " + result[i].participant;
        //           }
        //         }
        //         let title = `Firebase reports successful request for ${firebaseSuccess.length} / ${result.length}`
        //         let message = "";
        //         if (firebaseError.length > 0) {
        //           message = "error for " + firebaseErrorString;
        //         } else {
        //           message = "Firebase request was successful for all participants."
        //         }
        //         this.displaySuccess(title, message);
        //         resolve(result);
        //         // this.commandRegistry.parseCommand("list cloudmessages");
        //       }).catch(error => {
        //         this.displayCloudmessageError(error)
        //         console.error(error);
        //         reject(error);
        //       })
        //     } // end function sendCloudmessage
        //     if (cloudMessage.payload.data.cloudmessage_reference_id) {
        //       sendCloudmessage()
        //     } else {
        //       this.cloudmessageSource.save(cloudMessage.get()).then((result: any) => {
        //         cloudMessage.payload.data.cloudmessage_reference_id = result.id;
        //         cloudMessage.payload.data.cloudmessage_reference_uuid = result.uuid;
        //         sendCloudmessage();
        //       })
        //     }
        //   })
        // this.commandRegistry.command('list cloudmessages', "get a list of cloudmessages that have been issued", "cloudmessages")
        //   // TODO:
        //   // .option('-g, --grouped', 'view cloudmessages of the same messageid grouped into one row')
        //   // .option('-e, --expanded', 'view every cloudmessage as an individual row')
        //   .action((args, commandString, resolve, reject) => {
        //     let components = this.insertComponent(CloudmessageList2Component, commandString);
        //     components.cmdContainer.commandString = commandString;
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   })
        // this.commandRegistry.command('open cloudmessage <messageid>', "bring up the details of a specific cloudmesage", "cloudmessages")
        //   // TODO:
        //   // .option('-g, --grouped', 'view cloudmessages of the same messageid grouped into one row')
        //   // .option('-e, --expanded', 'view every cloudmessage as an individual row')
        //   .action((args, commandString, resolve, reject) => {
        //     if (args.messageid) {
        //       this.cloudmessageSource.fetchSingle({ messageid: args.messageid }).then(result => {
        //         let components = this.insertComponent(CloudmessageEditor2Component, commandString);
        //         let cloudmessageEditor = components.component;
        //         components.cmdContainer.commandString = commandString;
        //         if (!result) {
        //           result = { messageid: args.messageid }
        //         }
        //         cloudmessageEditor.setConfig(result);
        //         this.clearActiveCommandLine()
        //         resolve(this);
        //       }).catch(error => {
        //         console.log(error)
        //         reject(error);
        //       })
        //     }
        //     else {
        //       let components = this.insertComponent(CloudmessageEditor2Component, commandString);
        //       let cloudmessageEditor = components.component;
        //       components.cmdContainer.commandString = commandString;
        //       cloudmessageEditor.setConfig();
        //       this.clearActiveCommandLine()
        //     }
        //   })
        // this.commandRegistry.command('cloudmessage report <messageid>', "see how the cloudmessage was delivered", "cloudmessages")
        //   .action((args, commandString, resolve, reject) => {
        //     if (args.messageid) {
        //       this.cloudmessageSource.fetchReport({ messageid: args.messageid }).then(result => {
        //         let components = this.insertComponent(CloudmessageReportComponent, commandString);
        //         let cloudmessageReport = components.component;
        //         components.cmdContainer.commandString = commandString;
        //         cloudmessageReport.setConfig(result);
        //         this.clearActiveCommandLine();
        //         resolve(this);
        //       }).catch(error => {
        //         console.error(error);
        //         reject(error);
        //       })
        //     }
        //   })
        // this.commandRegistry.command('researcherinfo', "show information about this account", "researcher")
        //   .action((args, commandString, resolve, reject) => {
        //     this.storage.get("userLoggedIn").then(result => {
        //       let components = this.insertComponent(ResearcherInfoComponent, commandString);
        //       // let cmdContainer = this.echo(this.black("researcher identification string is ") + this.red(result.identifier));
        //       // cmdContainer.commandString = "researcherinfo";
        //       this.clearActiveCommandLine()
        //       resolve(this);
        //     });
        //   })
        // this.commandRegistry.command('myIdentifier', "print this researcher's identifier string", "researcher")
        //   .action((args, commandString, resolve, reject) => {
        //     this.storage.get("userLoggedIn").then(result => {
        //       this.echo(this.yellow(result.identifier));
        //       this.clearActiveCommandLine()
        //       resolve(this);
        //     });
        //   })
        // this.commandRegistry.command('configure mailserver', "allow sending emails from your smtp account", "researcher")
        //   .action((args, commandString, resolve, reject) => {
        //     // this.storage.get("userLoggedIn").then(result=>{
        //     //   this.echo(this.yellow(result.identifier));
        //     // });
        //     this.modalCtrl.create({ component: EmailServerConfigComponent, componentProps: { args: args, commandString: commandString } }).then(c => c.present());
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   })
        // this.commandRegistry.command('notifications', "show list of incoming notifications from the server", "researcher")
        //   .action((args, commandString, resolve, reject) => {
        //     let components = this.insertComponent(SocketEventReceiverComponent, commandString);
        //     components.cmdContainer.commandString = commandString;
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   })
        // this.commandRegistry.command('report <message>', "send a message to the developer", "researcher")
        //   .option('-t, --type', 'indicate severity/nature of report')
        //   .action((args, commandString, resolve, reject) => {
        //     this.clearActiveCommandLine()
        //     if (!args.options.type) {
        //       args.options.type = ["unassigned"];
        //     }
        //     this.api.report(args.message, args.options.type).then((result) => {
        //       resolve(this);
        //     }).catch(error => {
        //       reject(error);
        //     })
        //   })
        // this.commandRegistry.command("test", "conduct a functionality test with a participant or a group", "researcher")
        //   .option('-p, --participant <participant>', "which participant to do it for")
        //   .option('-g, --group <group>', 'which group to do it for')
        //   .action((args, commandString, resolve, reject) => {
        //     this.clearActiveCommandLine()
        //     //check if token for user or users is known
        //     let runTest = (participants) => {
        //       let cloudmessageDocument = EditorComponent.generateDocument("It is meant to be attached to a dataNotification cloumdmessage");
        //       let ruledoc = EditorComponent.generateDocument("It is meant to be opened via a triggered notification");
        //       let alwaysAvailableDoc = EditorComponent.generateDocument("It is meant to be always available");
        //       //prepare an allocation rule for today and save it to the database
        //       let triggeredRule: any = RuleEditorComponent.generateTriggeredAllocationRule()
        //       triggeredRule.participants = participants;
        //       triggeredRule.groups = args.options.group;
        //       triggeredRule.documents = [ruledoc]
        //       triggeredRule.alwaysAvailable = false;
        //       this.global.createAllocationRule(triggeredRule).then((result: any) => {
        //         // this.global.updateAllocationRule(result.id, false, result.name, args.options.participant, args.options.group, [ruledoc] , result.rule).then(result=>{
        //         // })
        //       });
        //       let alwaysAvailableRule: any = AllocationComposerComponent.generateAlwaysAvailableAllocationRule()
        //       alwaysAvailableRule.participants = participants;
        //       alwaysAvailableRule.groups = args.options.group;
        //       alwaysAvailableRule.documents = [alwaysAvailableDoc]
        //       alwaysAvailableRule.alwaysAvailable = true;
        //       this.global.createAllocationRule(alwaysAvailableRule).then(result => {
        //       });
        //     }
        //     let participants = [];
        //     let getParticipantsFromGroups = new Promise((resolve, reject) => {
        //       if (args.options.group) {
        //         this.api.listGroups(args.options.group).then((result: any) => {
        //           for (let i = 0; i < result.rows.length; i++) {
        //             participants = participants.concat(result.rows[i].participants)
        //             resolve(participants)
        //           }
        //         }).catch(error => {
        //           resolve(participants)
        //         })
        //       }
        //     })
        //     getParticipantsFromGroups.then(p => {
        //       participants = participants.concat(p);
        //       //now that we have all the participants, make sure they all have tokens
        //     })
        //     return;
        //     //create a document and save it to the database
        //   })
        // this.commandRegistry.command('logout', "log out of this session", "researcher")
        //   .action((args, commandString) => {
        //     this.storage.set('jwt', null).then(() => {
        //       this.storage.set('email', null).then(() => {
        //         this.storage.set('password', null).then(() => {
        //           this.storage.set('userLoggedIn', null).then(() => {
        //             this.clearActiveCommandLine()
        //             window.location.reload()
        //           })
        //         })
        //       })
        //     })
        //   })
        // this.commandRegistry.command('what now', "recommendations on how to interact with the system", "UI")
        //   .action((args, commandString, resolve, reject) => {
        //     let components = this.insertComponent(WhatnowComponent, commandString);
        //     let whatNowComponent = components.component;
        //     resolve();
        //     this.clearActiveCommandLine();
        //   })
        // this.commandRegistry.command('panel <number>', "make numbered panel active or add new panel to screen", "UI")
        //   .action((args, commandString, resolve, reject) => {
        //     this.clearActiveCommandLine()
        //     if (!args.number) {
        //       this.newSplit();
        //     } else if (args.number <= this.splits) {
        //       //choose the panel
        //       this.activeTab = args.number - 1;
        //     }
        //     this.changeDetector.detectChanges();
        //     resolve(this);
        //   });
        // this.commandRegistry.command('move card <panel1_card1> <panel2>', "move card to different panel", "UI")
        //   .action((args, commandString, resolve, reject) => {
        //     this.clearActiveCommandLine()
        //     let separator = "_";
        //     if (args.panel1_card1.indexOf(',') != -1) { separator = "," }
        //     let panel1 = args.panel1_card1.split(separator)[0] - 1;
        //     let card1 = args.panel1_card1.split(separator)[1] - 1;
        //     let panel2 = args.panel2 - 1
        //     let elem = this.commandOutputComponentLists[panel1][card1].instance.element.nativeElement;
        //     this.moveCommandOutputToSplitByIndex(elem, panel2);
        //     resolve(this);
        //   });
        // this.commandRegistry.command('destroy card <panel_card>', "remove card", "UI")
        //   .action((args, commandString, resolve, reject) => {
        //     this.clearActiveCommandLine()
        //     let separator = "_";
        //     if (args.panel_card.indexOf(',') != -1) { separator = "," }
        //     let panel = args.panel_card.split(separator)[0] - 1;
        //     let card = args.panel_card.split(separator)[1] - 1;
        //     this.destroyCommandOutput(panel, card);
        //     resolve(this);
        //   });
        // this.commandRegistry.command('remove panel', "move card to different panel", "UI")
        //   .action((args, commandString, resolve, reject) => {
        //     this.clearActiveCommandLine()
        //     let separator = "_";
        //     if (args.panel1_card1.indexOf(',') != -1) { separator = "," }
        //     let panel1 = args.panel1_card1.split(separator)[0] - 1;
        //     let card1 = args.panel1_card1.split(separator)[1] - 1;
        //     let panel2 = args.panel2 - 1
        //     let elem = this.commandOutputComponentLists[panel1][card1].instance.element.nativeElement;
        //     this.moveCommandOutputToSplitByIndex(elem, panel2);
        //     resolve(this);
        //   });
        // this.commandRegistry.command('batch', "execute a batch of commands", "UI")
        //   .option('-c, --command', 'command to run')
        //   .action((args, commandString, resolve, reject) => {
        //     this.clearActiveCommandLine()
        //     if (!args.options.command.length) {
        //       //no commands provided, show box for entering
        //     } else {
        //       for (let i = 0; i < args.options.command.length; i++) {
        //         let f = this.commandRegistry.parseCommand("help");
        //       }
        //     }
        //     // this.api.report(args.message, args.options.type)
        //   })
        // this.commandRegistry.command("ui viewer", "display help for items when the mouse is over them", "UI")
        //   .action((args, commandString, resolve, reject) => {
        //     let cmdContainer = this.insertComponent(RealtimehelpComponent, commandString).cmdContainer;
        //     cmdContainer.commandString = commandString;
        //     this.clearActiveCommandLine()
        //     resolve(this);
        //   })
        // this.commandRegistry.command('startwith <command>', 'add command to a list of commands executed at startup', "UI")
        //   .action((args, commandString, resolve, reject) => {
        //     this.clearActiveCommandLine()
        //     let command = commandString.substr(10).trim();
        //     if (command == "clear") {
        //       this.commandRegistry.clearStartupCommands();
        //     } else {
        //       this.commandRegistry.addToStartupCommands(command);
        //     }
        //   })
    };
    PulseCLIComponent.prototype.clearActiveCommandLine = function () {
        if (this.commandLine) {
            if (this.commandLine._results[this.activeTab]) {
                this.commandLine._results[this.activeTab].clear();
            }
        }
    };
    // private displaySuccess(title, message) {
    //   this.alertCtrl.create({
    //     header: title,
    //     message: message,
    //     buttons: ["ok"]
    //   }).then(c => c.present());
    // }
    // public displayCloudmessageError(error) {
    //   console.error(error);
    //   let e = error.error;
    //   let message = e.message;
    //   switch (e.code) {
    //     case "messaging/registration-token-not-registered":
    //       message = `firebase token for participant ${e.participant} is invalid`
    //       break;
    //   }
    //   this.alertCtrl.create({
    //     header: `Error`,
    //     message: message,
    //     buttons: ["ok"]
    //   }).then(c => c.present());
    // }
    PulseCLIComponent.prototype.ifCommandOutputsAreMoreThanVisibleLimitHideTheTopOne = function (tabIndex) {
        var _this = this;
        if (this.commandOutputComponentLists[tabIndex].length > this.limitVisibleCommandOuputComponents) {
            var cmdToHide_1 = this.commandOutputComponentLists[tabIndex].splice(0, 1)[0];
            this.outputChildren._results[tabIndex].detach(this.outputChildren._results[tabIndex].indexOf(cmdToHide_1.hostView));
            this.renderer.setStyle(cmdToHide_1.instance.element.nativeElement, "opacity", 0);
            //pull it up
            this.renderer.setStyle(cmdToHide_1.instance.element.nativeElement, "top", 0 * 35 - 50 + "px");
            setTimeout(function () {
                _this.renderer.setStyle(cmdToHide_1.instance.element.nativeElement, "display", "none");
            }, 600);
            this.hiddenCommandComponents[tabIndex].push(cmdToHide_1);
            this.commandComponentHistories[tabIndex].push(cmdToHide_1.instance.commandString);
        }
    };
    PulseCLIComponent.prototype.insertComponent = function (component, commandString) {
        //  create a container for the component that presents it as the ouput of a command
        var commandOutputComponentRef = this.componentFactoryResolver.resolveComponentFactory(_command_output_component_command_output_component__WEBPACK_IMPORTED_MODULE_2__["CommandOutputComponent"]).create(this.injector);
        var c = commandOutputComponentRef.instance.element.nativeElement;
        c.id = this.activeTab + "-" + this.createdComponentsCounter;
        this.createdComponentsCounter++;
        this.outputChildren._results[this.activeTab].insert(commandOutputComponentRef.hostView);
        this.commandOutputComponentLists[this.activeTab].push(commandOutputComponentRef);
        this.ifCommandOutputsAreMoreThanVisibleLimitHideTheTopOne(this.activeTab);
        this.renderer.setStyle(c, "opacity", "1");
        var tab = this.activeTab;
        // setTimeout(() => {
        this.resetHeightsForCommandOutputList(tab);
        // }, 1);
        if (commandString)
            commandOutputComponentRef.instance.commandString = commandString;
        //  insert the container into this cli page
        // this.output.insert(commandOutputComponentContainerRef.hostView);
        //  if there's a component, create it
        if (component) {
            var componentRef = this.componentFactoryResolver.resolveComponentFactory(component).create(this.injector);
            //  insert the component into the container
            commandOutputComponentRef.instance.container.insert(componentRef.hostView);
            // this.scrollToBottom();
            //add the componentRef object to this element so we can tell it to destroy itself
            commandOutputComponentRef.instance.ref = commandOutputComponentRef;
            commandOutputComponentRef.instance.containedComponent = componentRef.instance;
            return { component: componentRef.instance, cmdContainer: commandOutputComponentRef.instance };
        }
        else {
            // this.scrollToBottom();
            //add the componentRef object to this element so we can tell it to destroy itself
            commandOutputComponentRef.instance.ref = commandOutputComponentRef;
            return { component: null, cmdContainer: commandOutputComponentRef.instance };
        }
    };
    PulseCLIComponent.prototype.findComponentIndex = function (element, tabIndex) {
        if (typeof tabIndex != "undefined") {
            for (var i = 0; i < this.commandOutputComponentLists[tabIndex].length; i++) {
                var el = this.commandOutputComponentLists[tabIndex][i].instance.element.nativeElement;
                if (el === element) {
                    return i;
                }
            }
            return -1;
        }
        else {
            for (var i = 0; i < this.splits; i++) {
                var index = this.findComponentIndex(element, i);
                if (index != -1) {
                    return { tab: i, index: index };
                }
            }
            console.error("should be impossible to not find it!!");
            return -1;
        }
    };
    PulseCLIComponent.prototype.bringCommandOutputToFront = function (event, tabIndex) {
        var _this = this;
        event.stopPropagation();
        var componentIndex = this.findComponentIndex(event.srcElement, tabIndex);
        //if commandOutput is already in front you should do nothing
        if (componentIndex === this.commandOutputComponentLists[tabIndex].length - 1) {
            return;
        }
        var component = this.commandOutputComponentLists[tabIndex].splice(componentIndex, 1)[0];
        this.commandOutputComponentLists[tabIndex].push(component);
        this.outputChildren._results[tabIndex].detach(this.outputChildren._results[tabIndex].indexOf(component.hostView));
        setTimeout(function () {
            var insertResult = _this.outputChildren._results[tabIndex].insert(component.hostView);
            //TODO: change it also for commandComponentHistories
            if (_this.commandComponentHistories[tabIndex].length > 0) {
                var cHistory = _this.commandComponentHistories[tabIndex].splice(componentIndex, 1)[0];
                _this.commandComponentHistories[tabIndex].push(cHistory);
            }
            _this.resetHeightsForCommandOutputList(tabIndex);
            _this.changeDetector.detectChanges();
        });
    };
    PulseCLIComponent.prototype.bringCommandOutputHistoryToFront = function (event, tabIndex, componentIndex) {
        var component = this.hiddenCommandComponents[tabIndex].splice(componentIndex, 1)[0];
        this.renderer.setStyle(component.instance.element.nativeElement, "display", "block");
        this.renderer.setStyle(component.instance.element.nativeElement, "opacity", "1");
        this.commandOutputComponentLists[tabIndex].push(component);
        // let res1 = this.outputChildren._results[tabIndex].detach(this.outputChildren._results[tabIndex].indexOf(component.hostView))
        var res2 = this.outputChildren._results[tabIndex].insert(component.hostView);
        //remove it from commandComponentHistories
        this.commandComponentHistories[tabIndex].splice(componentIndex, 1)[0];
        // this.commandComponentHistories[tabIndex].push(cHistory);
        this.ifCommandOutputsAreMoreThanVisibleLimitHideTheTopOne(tabIndex);
        this.changeDetector.detectChanges();
        this.resetHeightsForCommandOutputList(tabIndex);
    };
    PulseCLIComponent.prototype.resetHeightsForCommandOutputList = function (tab) {
        var maxHeight = parseInt(window.getComputedStyle(this.outputContainerChildren.toArray()[tab].element.nativeElement).height);
        for (var i = 0; i < this.commandOutputComponentLists[tab].length; i++) {
            var top_1 = i * 35;
            var height = maxHeight - top_1;
            var elem = this.commandOutputComponentLists[tab][i].instance.element.nativeElement;
            this.renderer.setStyle(elem, "top", top_1 + "px");
            this.renderer.setStyle(elem, "z-index", 20 * i);
            this.renderer.setStyle(elem, "height", height + "px");
        }
    };
    PulseCLIComponent.prototype.destroyCommandOutputEvent = function (event, tabIndex) {
        event.stopPropagation();
        var componentIndex = this.findComponentIndex(event.srcElement, tabIndex);
        this.commandRegistry.parseCommand("destroy card " + (tabIndex + 1) + "," + (componentIndex + 1));
    };
    PulseCLIComponent.prototype.destroyCommandOutput = function (tabIndex, componentIndex) {
        var comp = this.commandOutputComponentLists[tabIndex].splice(componentIndex, 1)[0];
        var elem = comp.instance.element.nativeElement;
        this.resetHeightsForCommandOutputList(tabIndex);
        this.renderer.setStyle(elem, "opacity", 0);
        //pull it down
        this.renderer.setStyle(elem, "top", componentIndex * 35 + 500 + "px");
        setTimeout(function () {
            comp.destroy();
        }, 600);
    };
    // addObjectListForResult(result) {
    //   let objectListComponentRef: ComponentRef<any> = this.componentFactoryResolver.resolveComponentFactory(ObjectListComponent).create(this.injector);
    //   objectListComponentRef.instance.setList(result);
    //   let outputRef = this.componentFactoryResolver.resolveComponentFactory(CommandOutputComponent).create(this.injector);
    //   outputRef.instance.commandString = result.commandString;
    //   outputRef.instance.container.insert(objectListComponentRef.hostView);
    //   this.output.insert(outputRef.hostView);
    // }
    PulseCLIComponent.prototype.shouldRenderSeparator = function (i) {
        var val = (this.commandOutputComponentLists.length > 1) && (i < this.commandOutputComponentLists.length - 1);
        return val;
    };
    PulseCLIComponent.prototype.scrollToBottom = function () {
        // setTimeout(() => {
        //   this.outputContainerChildren._results[this.activeTab].element.nativeElement.scroll({
        //     top: this.outputContainerChildren._results[this.activeTab].element.nativeElement.scrollHeight,
        //     behavior: 'smooth'
        //   });
        //   // this.outputContainer.nativeElement.scroll({
        //   //   top: this.outputContainer.nativeElement.scrollHeight,
        //   //   behavior: 'smooth'
        //   // });
        // }, 100);
    };
    PulseCLIComponent.prototype.setFocusToCommandLine = function () {
        this.commandLine._results[this.activeTab].setFocusToCommandLine();
    };
    ;
    PulseCLIComponent.prototype.splitSeparatorMousedown = function (event, index) {
        this.splitSeparatorArr[index].mousedown = true;
        this.indexOfSeparatorMouseDown = index;
    };
    PulseCLIComponent.prototype.splitSeparatorMouseup = function (event, index) {
    };
    PulseCLIComponent.prototype.splitContainerMouseUp = function (event) {
        for (var i = 0; i < this.splitSeparatorArr.length; i++) {
            this.splitSeparatorArr[i].mousedown = false;
        }
        this.indexOfSeparatorMouseDown = null;
    };
    PulseCLIComponent.prototype.splitContainerMousemove = function (event) {
        this.lastMouseMoveEvent = event;
        var index = this.indexOfSeparatorMouseDown;
        if (index === null)
            return;
        if (this.splitSeparatorArr[index].mousedown) {
            var movePercent = 100 * event.movementX / parseInt(window.getComputedStyle(this.splitContainer.nativeElement).width);
            this.splitWidthArr[index] += movePercent;
            if (this.splitWidthArr[index + 1]) {
                this.splitWidthArr[index + 1] -= movePercent;
            }
        }
        this.changeDetector.detectChanges();
    };
    PulseCLIComponent.prototype.commandOutputHeaderHasMouseDown = function (event) {
        this.commandOutputHeaderMouseDown = true;
        this.commandOutputNativeElementToMoveAround = event.detail.element;
        this.commandOutputHeaderMouseDownEvent = event.detail.mouseDownEvent;
        this.headerDragX = 0;
        this.headerDragY = 0;
    };
    PulseCLIComponent.prototype.checkDragToDecideIfItShouldMove = function () {
        if (this.commandOutputHeaderMouseDown) {
            //start moving based on drag
            this.headerDragX += this.lastMouseMoveEvent.movementX;
            this.headerDragY += this.lastMouseMoveEvent.movementY;
            if (Math.pow(this.headerDragX, 2) + Math.pow(this.headerDragX, 2) > 500) {
                this.prepareStartMoving();
                return true;
            }
        }
        else {
            this.headerDragX = 0;
            this.headerDragY = 0;
            return false;
        }
    };
    PulseCLIComponent.prototype.prepareStartMoving = function () {
        this.startMovingCommandOutput = true;
        this.splitBoundingClientRects = [];
        for (var i = 0; i < this.splitChildren.toArray().length; i++) {
            this.splitBoundingClientRects.push(this.splitChildren.toArray()[i].nativeElement.getBoundingClientRect());
        }
        var movingBox = this.commandOutputNativeElementToMoveAround.getBoundingClientRect();
        var mme = this.lastMouseMoveEvent;
        // this.startMovingCommandOutputMovementX += mme.pageX - movingBox.x - 20;
        // this.startMovingCommandOutputMovementY += mme.pageY - movingBox.y - 20;
        this.startMovingCommandOutputMovementX += mme.pageX - movingBox.x - this.commandOutputHeaderMouseDownEvent.offsetX;
        this.startMovingCommandOutputMovementY += mme.pageY - movingBox.y - this.commandOutputHeaderMouseDownEvent.offsetY;
    };
    PulseCLIComponent.prototype.mouseMoveWhileCommandOutputMouseDown = function (event) {
        if (!this.commandOutputHeaderMouseDown)
            return;
        if (this.commandOutputComponentLists.length == 1)
            return;
        if (this.checkDragToDecideIfItShouldMove() == false)
            return;
        if (!this.startMovingCommandOutput)
            return;
        this.commandOutputNativeElementToMoveAround.style.opacity = "0.7";
        this.commandOutputNativeElementToMoveAround.style.transform = "translate(" + this.startMovingCommandOutputMovementX + "px, " + this.startMovingCommandOutputMovementY + "px)";
        this.commandOutputNativeElementOriginalZIndex = this.commandOutputNativeElementToMoveAround.style.zIndex;
        this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "z-index", 3000);
        this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "position", "absolute");
        var cRect = this.commandOutputNativeElementToMoveAround.getBoundingClientRect();
        var x2 = cRect.x;
        var l2 = cRect.width;
        var y2 = cRect.y;
        var h2 = cRect.height;
        var overlaps = [];
        var wh = [];
        this.indexOfSplitWithMaximumOverlap = -1;
        var chosenRect;
        var currentMaxOverlap = 0;
        for (var i = 0; i < this.splitBoundingClientRects.length; i++) {
            var sRect = this.splitBoundingClientRects[i];
            var x1 = sRect.x;
            var l1 = sRect.width;
            var y1 = sRect.y;
            var h1 = sRect.height;
            var w = 0;
            var h = 0;
            if (((x2 + l2) > x1) && (x2 < (x1 + l1))) {
                if (x1 - x2 > 0) {
                    w = x2 + l2 - x1;
                }
                else {
                    w = x1 + l1 - x2;
                }
            }
            if (((y2 + h2) > y1) && (y2 < (y1 + h1))) {
                if (y1 - y2 > 0) {
                    h = y2 + h2 - y1;
                }
                else {
                    h = y1 + h1 - y2;
                }
            }
            var o = w * h;
            overlaps.push(o);
            if (i > 0) {
                if (o >= currentMaxOverlap) {
                    currentMaxOverlap = o;
                    this.indexOfSplitWithMaximumOverlap = i;
                    chosenRect = sRect;
                }
            }
            else {
                currentMaxOverlap = o;
                this.indexOfSplitWithMaximumOverlap = i;
                chosenRect = sRect;
            }
        }
        this.renderer.setStyle(this.movingProxy.element.nativeElement, "transform", "translate(" + chosenRect.x + "px, " + chosenRect.y + "px)");
        this.renderer.setStyle(this.movingProxy.element.nativeElement, "width", chosenRect.width + "px");
        this.renderer.setStyle(this.movingProxy.element.nativeElement, "height", chosenRect.height - 50 + "px");
        this.renderer.setStyle(this.movingProxy.element.nativeElement, "display", "block");
    };
    PulseCLIComponent.prototype.mouseUpWhileCommandOutputMouseDown = function () {
        this.commandOutputHeaderMouseDown = false;
        if (this.startMovingCommandOutput) {
            this.mouseMoveMustStopBecauseMouseIsUp();
        }
    };
    PulseCLIComponent.prototype.mouseMoveMustStopBecauseMouseIsUp = function () {
        this.commandOutputHeaderMouseDown = false;
        this.startMovingCommandOutput = false;
        clearTimeout(this.startMovingCommandOutputTimeout);
        this.startMovingCommandOutputMovementX = 0;
        this.startMovingCommandOutputMovementY = 0;
        this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "opacity", "1");
        this.renderer.setStyle(this.movingProxy.element.nativeElement, "display", "none");
        this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "transform", "");
        this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "z-index", this.commandOutputNativeElementOriginalZIndex);
        this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "position", "");
        // this.moveCommandOutputToSplitByIndex(this.commandOutputNativeElementToMoveAround, this.indexOfSplitWithMaximumOverlap);
        var tabAndIndex = this.findComponentIndex(this.commandOutputNativeElementToMoveAround);
        this.commandRegistry.parseCommand("move card " + (tabAndIndex.tab + 1) + "," + (tabAndIndex.index + 1) + ", " + (this.indexOfSplitWithMaximumOverlap + 1));
        this.headerDragX = 0;
        this.headerDragY = 0;
    };
    PulseCLIComponent.prototype.moveCommandOutputToSplitByIndex = function (nativeElement, destTab) {
        var _this = this;
        var tabAndIndex = this.findComponentIndex(nativeElement);
        var tab = tabAndIndex.tab;
        var componentIndex = tabAndIndex.index;
        //detach from one
        var component = this.commandOutputComponentLists[tab].splice(componentIndex, 1)[0];
        this.commandOutputComponentLists[destTab].push(component);
        this.outputChildren._results[tab].detach(this.outputChildren._results[tab].indexOf(component.hostView));
        setTimeout(function () {
            _this.outputChildren._results[destTab].insert(component.hostView);
            _this.ifCommandOutputsAreMoreThanVisibleLimitHideTheTopOne(destTab);
            _this.changeDetector.detectChanges();
            _this.resetHeightsForCommandOutputList(tab);
            _this.resetHeightsForCommandOutputList(destTab);
            _this.changeDetector.detectChanges();
        }, 10);
    };
    PulseCLIComponent.prototype.setActivePanel = function (panelIndex) {
        this.activeTab = panelIndex;
    };
    PulseCLIComponent.prototype.openMatSelectForCommandHistories = function (splitIndex) {
        //this.matSelectForCommandHistories
        // let matSelectClicked = this.matSelectForCommandHistories.toArray()[splitIndex].open();
    };
    PulseCLIComponent.prototype.selectSplit = function (index) {
        this.activeTab = index;
    };
    PulseCLIComponent.prototype.selectSplitFromEmptyPanelClick = function (event, index) {
        event.stopPropagation();
        if (this.commandOutputComponentLists[index].length == 0) {
            this.activeTab = index;
        }
    };
    PulseCLIComponent.prototype.closeSplit = function (event, index) {
        // TODOHERE
        event.stopPropagation();
        window.a = this;
        // console.log(this.commandOutputComponentLists);
        var componentList = this.commandOutputComponentLists[index];
        for (var i = 0; i < componentList.length; i++) {
            componentList[i].destroy();
            // this.commandOutputNativeElementLists[index][i].remove()
        }
        this.splits--;
        this.commandOutputComponentLists.splice(index, 1);
        // this.commandOutputNativeElementLists.splice(index, 1);
        this.splitSeparatorArr.splice(index, 1);
        if (this.activeTab > this.splits - 1) {
            this.activeTab = this.splits - 1;
        }
        this.recalcSplitWidths();
        this.changeDetector.detectChanges();
    };
    PulseCLIComponent.prototype.commandIssued = function (event, activeIndex) {
        event.stopPropagation();
        this.activeTab = activeIndex;
        var resultPromise = this.commandRegistry.parseCommand(event.detail.command, { enterIntoHistory: event.detail.enterIntoHistory, args: event.detail.args });
        if (resultPromise) {
            resultPromise.then(function (result) {
                if (event.detail.success) {
                    event.detail.success(result);
                }
            }).catch(function (error) {
                console.error(error);
                if (event.detail.error) {
                    event.detail.error(error);
                }
            });
        }
    };
    PulseCLIComponent.prototype.ping = function () {
        debugger;
    };
    PulseCLIComponent.prototype.isLocalCommand = function (command) {
        for (var i = 0; i < this.localCommands.length; i++) {
            if (command.indexOf(this.localCommands[i]) != -1) {
                return true;
            }
        }
    };
    PulseCLIComponent.prototype.echo = function (text) {
        var cmdContainer = this.insertComponent().cmdContainer;
        cmdContainer.placeInContainer("<div style=\"user-select:text\">" + text + "</div>");
        cmdContainer.hideCommand();
        return cmdContainer;
    };
    PulseCLIComponent.prototype.red = function (text) {
        return "<span style=\"color:orangered\">" + text + "</span>";
    };
    PulseCLIComponent.prototype.yellow = function (text) {
        return "<span style=\"color:yellow\">" + text + "</span>";
    };
    PulseCLIComponent.prototype.white = function (text) {
        return "<span style=\"color:#AAA\">" + text + "</span>";
    };
    PulseCLIComponent.prototype.black = function (text) {
        return "<span style=\"color:#333\">" + text + "</span>";
    };
    PulseCLIComponent.prototype.commandStringReceived = function (event) {
        this.commandLine._results[this.activeTab].setText(event.detail);
        this.commandLine._results[this.activeTab].setFocusToCommandLine();
    };
    PulseCLIComponent.prototype.mouseover = function (event) {
        // this.realtimehelpService.getHelp(event.target);
    };
    PulseCLIComponent.prototype.keydown = function (event) {
        this.global.keyDown[event.key] = true;
    };
    PulseCLIComponent.prototype.keyup = function (event) {
        this.global.keyDown[event.key] = false;
    };
    PulseCLIComponent.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injector"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] },
        { type: _command_registry_service_command_registry_service__WEBPACK_IMPORTED_MODULE_4__["CommandRegistryService"] },
        { type: _pulse_cli_service__WEBPACK_IMPORTED_MODULE_5__["PulseCLIService"] }
    ]; };
    PulseCLIComponent.propDecorators = {
        terminalContainer: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ['terminal', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] },] }],
        outputContainer: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ['outputContainer', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] },] }],
        outputContainerChildren: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChildren"], args: ['outputContainer', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"] },] }],
        output: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ['output', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"] },] }],
        outputChildren: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChildren"], args: ['output', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"] },] }],
        commandLine: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChildren"], args: [_command_line_component_command_line_component__WEBPACK_IMPORTED_MODULE_3__["CommandLineComponent"],] }],
        splitContainer: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ['splitContainer', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], static: true },] }],
        splitChildren: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChildren"], args: ['splitChild', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] },] }],
        movingProxy: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ['movingProxy', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], static: true },] }]
    };
    PulseCLIComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'lib-pulseCLI',
            template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! raw-loader!./pulse-cli.component.html */ "./node_modules/raw-loader/dist/cjs.js!./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.component.html")).default,
            styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! ./pulse-cli.component.scss */ "./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.component.scss")).default]
        }),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injector"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            _command_registry_service_command_registry_service__WEBPACK_IMPORTED_MODULE_4__["CommandRegistryService"],
            _pulse_cli_service__WEBPACK_IMPORTED_MODULE_5__["PulseCLIService"]])
    ], PulseCLIComponent);
    return PulseCLIComponent;
}());



/***/ }),

/***/ "./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.module.ts":
/*!****************************************************************************!*\
  !*** ./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.module.ts ***!
  \****************************************************************************/
/*! exports provided: PulseCLIModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PulseCLIModule", function() { return PulseCLIModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _pulse_cli_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pulse-cli.component */ "./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.component.ts");
/* harmony import */ var _command_output_component_command_output_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../command-output.component/command-output.module */ "./projects/pulse-cli/src/lib/command-output.component/command-output.module.ts");
/* harmony import */ var _command_line_component_command_line_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../command-line.component/command-line.module */ "./projects/pulse-cli/src/lib/command-line.component/command-line.module.ts");






var PulseCLIModule = /** @class */ (function () {
    function PulseCLIModule() {
    }
    PulseCLIModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_pulse_cli_component__WEBPACK_IMPORTED_MODULE_3__["PulseCLIComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _command_output_component_command_output_module__WEBPACK_IMPORTED_MODULE_4__["CommandOutputComponentModule"],
                _command_line_component_command_line_module__WEBPACK_IMPORTED_MODULE_5__["CommandLineComponentModule"]
            ],
            exports: [_pulse_cli_component__WEBPACK_IMPORTED_MODULE_3__["PulseCLIComponent"]]
        })
    ], PulseCLIModule);
    return PulseCLIModule;
}());



/***/ }),

/***/ "./projects/pulse-cli/src/lib/pulse-cli.service.ts":
/*!*********************************************************!*\
  !*** ./projects/pulse-cli/src/lib/pulse-cli.service.ts ***!
  \*********************************************************/
/*! exports provided: PulseCLIService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PulseCLIService", function() { return PulseCLIService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");


var PulseCLIService = /** @class */ (function () {
    function PulseCLIService() {
        this.keyDown = {};
        this.UI = { cli: [] };
    }
    PulseCLIService.ctorParameters = function () { return []; };
    PulseCLIService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [])
    ], PulseCLIService);
    return PulseCLIService;
}());



/***/ }),

/***/ "./projects/pulse-cli/src/lib/safe-html.ts":
/*!*************************************************!*\
  !*** ./projects/pulse-cli/src/lib/safe-html.ts ***!
  \*************************************************/
/*! exports provided: SafeHtmlPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SafeHtmlPipe", function() { return SafeHtmlPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");



/**
 * Generated class for the SafeHtmlPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
var SafeHtmlPipe = /** @class */ (function () {
    /**
     * Takes a value and makes it lowercase.
     */
    function SafeHtmlPipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SafeHtmlPipe.prototype.transform = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.sanitizer.bypassSecurityTrustHtml(value);
    };
    SafeHtmlPipe.ctorParameters = function () { return [
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["DomSanitizer"] }
    ]; };
    SafeHtmlPipe = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            name: 'safeHtml',
        }),
        Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["DomSanitizer"]])
    ], SafeHtmlPipe);
    return SafeHtmlPipe;
}());



/***/ }),

/***/ "./projects/pulse-cli/src/public-api.ts":
/*!**********************************************!*\
  !*** ./projects/pulse-cli/src/public-api.ts ***!
  \**********************************************/
/*! exports provided: PulseCLIService, PulseCLIComponent, PulseCLIModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_pulse_cli_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/pulse-cli.service */ "./projects/pulse-cli/src/lib/pulse-cli.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PulseCLIService", function() { return _lib_pulse_cli_service__WEBPACK_IMPORTED_MODULE_0__["PulseCLIService"]; });

/* harmony import */ var _lib_pulse_cli_component_pulse_cli_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/pulse-cli.component/pulse-cli.component */ "./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PulseCLIComponent", function() { return _lib_pulse_cli_component_pulse_cli_component__WEBPACK_IMPORTED_MODULE_1__["PulseCLIComponent"]; });

/* harmony import */ var _lib_pulse_cli_component_pulse_cli_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/pulse-cli.component/pulse-cli.module */ "./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PulseCLIModule", function() { return _lib_pulse_cli_component_pulse_cli_module__WEBPACK_IMPORTED_MODULE_2__["PulseCLIModule"]; });

/*
 * Public API Surface of pulse-cli
 */





/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");



var routes = [];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _projects_pulse_cli_src_public_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../projects/pulse-cli/src/public-api */ "./projects/pulse-cli/src/public-api.ts");



var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'cliLib';
    }
    AppComponent.propDecorators = {
        pulse: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"], args: ['pulse', { read: _projects_pulse_cli_src_public_api__WEBPACK_IMPORTED_MODULE_2__["PulseCLIComponent"], static: true },] }]
    };
    AppComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html")).default,
            styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")).default]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _projects_pulse_cli_src_lib_pulse_cli_component_pulse_cli_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.module */ "./projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.module.ts");





// import { PulseCLIModule } from 'pulse-cli';

var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
                _projects_pulse_cli_src_lib_pulse_cli_component_pulse_cli_module__WEBPACK_IMPORTED_MODULE_5__["PulseCLIModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/__ivy_ngcc__/fesm2015/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/amv/code/majime2/cliLib/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map
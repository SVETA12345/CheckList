(this["webpackJsonpreact-material-admin"]=this["webpackJsonpreact-material-admin"]||[]).push([[0],{985:function(e,t,n){},992:function(e,t,n){"use strict";n.r(t);var c=n(3),s=n(0),a=n(965),i=n(966),r=n(967),l=n(968),o=n(327),j=n(319),b=n.n(j),u=n(976),d=n(46),O=(n(985),n(1));t.default=function(e){var t=e.active,n=e.setActive,j=e.las,h=e.onUpdate,p=localStorage.getItem("role"),x=Object(s.useState)(null),m=Object(c.a)(x,2),f=(m[0],m[1],Object(s.useRef)(null),Object(s.useState)("")),v=Object(c.a)(f,2),C=v[0],g=v[1],y=Object(s.useState)(""),S=Object(c.a)(y,2),k=S[0],_=S[1],F=Object(s.useState)(""),L=Object(c.a)(F,2),G=L[0],w=L[1],E=Object(s.useState)(""),J=Object(c.a)(E,2),W=J[0],A=J[1],I=Object(s.useState)(null),R=Object(c.a)(I,2),U=R[0],q=R[1],z=Object(s.useState)(!0),B=Object(c.a)(z,2),D=B[0],H=B[1],K=Object(s.useState)({}),M=Object(c.a)(K,2),N=M[0],P=M[1];function Q(e){var t=e.target.name,n=e.target.value;"cap"===t?g(n):"parametres"===t?_(n):"mnemodescription"===t?w(n):"tabledata"===t&&A(n)}return Object(s.useEffect)((function(){P({cap:C,parametres:k,mnemodescription:G,tabledata:W,las_file_count:U,status:D})}),[C,k,G,W,D]),Object(s.useEffect)((function(){g(j.cap),_(j.parametres),w(j.mnemodescription),A(j.tabledata),q(j.las_file_count),H(j.status)}),[j]),Object(O.jsx)(O.Fragment,{children:Object(O.jsxs)(a.a,{open:t,onClose:n,maxWidth:"sm",fullWidth:!0,children:[Object(O.jsxs)(i.a,{children:["\u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 Las-\u0444\u0430\u0439\u043b\u0430",Object(O.jsx)("div",{style:{float:"right"},children:Object(O.jsx)(b.a,{checked:D,width:150,onChange:function(e){return H(e)},onlabel:"\u041f\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442",offlabel:"\u041e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442",onstyle:"success",offstyle:"danger"})})]}),Object(O.jsx)(r.a,{children:Object(O.jsxs)(u.a,{children:[Object(O.jsxs)(u.a.Group,{children:[Object(O.jsx)(u.a.Label,{htmlFor:"cap",children:"\u0428\u0430\u043f\u043a\u0430"}),Object(O.jsxs)(u.a.Control,{disabled:!("user"===p||"superuser"===p),as:"select",id:"cap",name:"cap",value:C,onChange:function(e){return Q(e)},children:[Object(O.jsx)("option",{}),Object(O.jsx)("option",{children:"\u041f\u043e\u043b\u043d\u0430\u044f"}),Object(O.jsx)("option",{children:"\u0427\u0430\u0441\u0442\u0438\u0447\u043d\u0430\u044f"}),Object(O.jsx)("option",{children:"\u041e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442"})]})]}),Object(O.jsxs)(u.a.Group,{children:[Object(O.jsx)(u.a.Label,{htmlFor:"parametres",children:"\u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b"}),Object(O.jsxs)(u.a.Control,{disabled:!("user"===p||"superuser"===p),as:"select",id:"parametres",name:"parametres",value:k,onChange:function(e){return Q(e)},children:[Object(O.jsx)("option",{}),Object(O.jsx)("option",{children:"\u041f\u043e\u043b\u043d\u0430\u044f"}),Object(O.jsx)("option",{children:"\u0427\u0430\u0441\u0442\u0438\u0447\u043d\u0430\u044f"}),Object(O.jsx)("option",{children:"\u041e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442"})]})]}),Object(O.jsxs)(u.a.Group,{children:[Object(O.jsx)(u.a.Label,{htmlFor:"mnemodescription",children:"\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u043c\u043d\u0435\u043c\u043e\u043d\u0438\u043a"}),Object(O.jsxs)(u.a.Control,{disabled:!("user"===p||"superuser"===p),as:"select",id:"mnemodescription",name:"mnemodescription",value:G,onChange:function(e){return Q(e)},children:[Object(O.jsx)("option",{}),Object(O.jsx)("option",{children:"\u041f\u043e\u043b\u043d\u0430\u044f"}),Object(O.jsx)("option",{children:"\u0427\u0430\u0441\u0442\u0438\u0447\u043d\u0430\u044f"}),Object(O.jsx)("option",{children:"\u041e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442"})]})]}),Object(O.jsxs)(u.a.Group,{children:[Object(O.jsx)(u.a.Label,{htmlFor:"tabledata",children:"\u0422\u0430\u0431\u043b\u0438\u0446\u0430 \u0441 \u0434\u0430\u043d\u043d\u044b\u043c\u0438"}),Object(O.jsxs)(u.a.Control,{disabled:!("user"===p||"superuser"===p),as:"select",id:"tabledata",name:"tabledata",value:W,onChange:function(e){return Q(e)},children:[Object(O.jsx)("option",{}),Object(O.jsx)("option",{children:"\u041f\u043e\u043b\u043d\u0430\u044f"}),Object(O.jsx)("option",{children:"\u0427\u0430\u0441\u0442\u0438\u0447\u043d\u0430\u044f"}),Object(O.jsx)("option",{children:"\u041e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442"})]})]})]})}),Object(O.jsxs)(l.a,{children:[Object(O.jsx)(o.a,{onClick:function(){!function(e){for(var t in g(""),_(""),w(""),A(""),q(null),e)e[t]=""}(N),h(N),Object(d.a)(N),n()},style:{outline:"none",visibility:"user"===p||"superuser"===p?"visible":"hidden"},children:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c"}),Object(O.jsx)(o.a,{onClick:function(){!function(e){for(var t in g("\u041f\u043e\u043b\u043d\u0430\u044f"),_("\u041f\u043e\u043b\u043d\u0430\u044f"),w("\u041f\u043e\u043b\u043d\u0430\u044f"),A("\u041f\u043e\u043b\u043d\u0430\u044f"),e)"las_file_count"!==t&&"status"!==t&&(e[t]="\u041f\u043e\u043b\u043d\u0430\u044f")}(N),h(N),Object(d.a)(N),n()},style:{outline:"none",visibility:"user"===p||"superuser"===p?"visible":"hidden"},children:"\u0412\u0441\u0435 \u043f\u043e\u043b\u043d\u044b\u0435"}),Object(O.jsx)(o.a,{onClick:function(){h(N),Object(d.a)(N),n()},style:{outline:"none",visibility:"user"===p||"superuser"===p?"visible":"hidden"},children:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c"})]})]})})}}}]);
//# sourceMappingURL=0.8d2021fe.chunk.js.map
简陋版服务端渲染
  - 实现同构
    - 同一个Home组件，经过客户端`ReactDom.hydrate`,经过服务端`react-dom/server renderToString`,将服务端的插入到`dom`中，将客户端打包生成的js通过`<script></script>` 形式插入到`dom`中

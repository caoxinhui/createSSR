import React from 'react'
export default class Controller {
    constructor() {
        this.jump = this.jump.bind(this)
    }
    init() {
        return this.render()
    }
    update(){

    }
    destory(){

    }
    render(){
        return (
            <div>
                <h1>detail: {JSON.stringify(this.location,null,2)}</h1>
                <ul>
                    <li><a href="/home" onClick={this.jump}>home page</a></li>
                    <li><a href="/list" onClick={this.jump}>list page</a></li>
                    <li><a href="/detail" onClick={this.jump}>detail page</a></li>
                </ul>
            </div>
        )
    }
    jump(event){
        event.preventDefault()
        let { pathname } = event.currentTarget
        this.goTo(pathname)
    }
}
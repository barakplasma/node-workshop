"use strict"
const expect = require('chai').expect
const dbFactory = require('../lib/db')
const tmp = require('tmp')

describe("db", function () {
  let db
  beforeEach(done => {
    tmp.dir((err, path) => {
      db = dbFactory(path)
      done()
    })
  })

  describe("addTodo", function () {
    it("adds first todo", (done) => {
      db.addTodo('aUser', 'hi', 7, (err) => {
        if (err) return done(err)
        db.listTodos('aUser', (err, todos) => {
          if (err) return done(err)
          expect(todos).to.deep.equal([{
            text: 'hi',
            id: 7
          }])
          done()
        })
      })
    })

    it("adds second todo", (done) => {
      /**
       * This test should add two todos and check that listTodo returns them
       */
      db.addTodo('aUser', 'hi', 7, (err) => {
        if (err) return done(err)
        db.addTodo('aUser', 'whatwhat', 8, (err) => {
          err ? done(err) :
            db.listTodos('aUser', (err, todos) => {
              err ? done(err) :
                expect(todos).to.deep.equal([{
                  text: 'hi',
                  id: 7
                }, {
                  text: 'whatwhat',
                  id: 8
                }])
              done();
            });
        })
      })
    })

    it("adds different todos to different users", (done) => {
      db.addTodo('aUser', 'hi', 3, (err) => {
        if (err) return done(err)
        db.addTodo('bUser', 'bye', 2, (err) => {
          if (err) return done(err)
          db.listTodos('aUser', (err, todos) => {
            if (err) return done(err)
            expect(todos).to.deep.equal(
              [{
                text: 'hi',
                id: 3
              }])
            db.listTodos('bUser', (err, todos) => {
              if (err) return done(err)
              expect(todos).to.deep.equal(
                [{
                  text: 'bye',
                  id: 2
                }])
              done()
            })
          })
        })
      })
    })

    it("can add todos with the same text", (done) => {
      db.addTodo('aUser', 'hi', 3, (err) => {
        if (err) return done(err)
        db.addTodo('aUser', 'hi', 2, (err) => {
          if (err) return done(err)
          db.listTodos('aUser', (err, todos) => {
            if (err) return done(err)
            expect(todos).to.deep.equal(
              [{
                text: 'hi',
                id: 3
              }, {
                text: 'hi',
                id: 2
              }])
            done()
          })
        })
      })
    })
  })

  describe("deleteTodo", function () {
    it("can delete the only existing todo", (done) => {
      /** 
       * This test creates a todo, deletes it, and checks that 
       * listTodo returns an empty list.
       * */
      db.addTodo('aUser', 'hi', 3, (err) => {
        if (err) return done(err)
        db.deleteTodo('aUser', 3, (err) => {
          if (err) return done(err)
          db.listTodos('aUser', (err, todos) => {
            if (err) return done(err)
            expect(todos).to.deep.equal([])
            done()
          })
        })
      })
    })
  

  it("can delete only the first todo", (done) => {
    db.addTodo('aUser', 'hi', 3, (err) => {
      if (err) return done(err)
      db.addTodo('aUser', 'bye', 2, (err) => {
        if (err) return done(err)
        db.deleteTodo('aUser', 3, (err) => {
          if (err) return done(err)
          db.listTodos('aUser', (err, todos) => {
            if (err) return done(err)
            expect(todos).to.deep.equal([{
              text: 'bye',
              id: 2
            }])
            done()
          })
        })
      })
    })
  })

  it("can delete only the last todo", (done) => {
    db.addTodo('aUser', 'hi', 3, (err) => {
      if (err) return done(err)
      db.addTodo('aUser', 'bye', 2, (err) => {
        if (err) return done(err)
        db.deleteTodo('aUser', 2, (err) => {
          if (err) return done(err)
          db.listTodos('aUser', (err, todos) => {
            if (err) return done(err)
            expect(todos).to.deep.equal([{
              text: 'hi',
              id: 3
            }])
            done()
          })
        })
      })
    })
  })

  it("can delete only the middle todo", (done) => {
    db.addTodo('aUser', 'hi', 3, (err) => {
      if (err) return done(err)
      db.addTodo('aUser', 'bye', 2, (err) => {
        if (err) return done(err)
        db.addTodo('aUser', 'middle', 17, (err) => {
          if (err) return done(err)
          db.deleteTodo('aUser', 17, (err) => {
            if (err) return done(err)
            db.listTodos('aUser', (err, todos) => {
              if (err) return done(err)
              expect(todos).to.deep.equal(
                [{
                  text: 'hi',
                  id: 3
                }, {
                  text: 'bye',
                  id: 2
                }])
              done()
            })
          })
        })
      })
    })
  })
})

describe("markTodo", function () {
  beforeEach((done) =>
    db.addTodo('aUser', 'hi', 0, done))

  it("should check an unchecked item", (done) => {
    db.markTodo('aUser', 0, (err) => {
      if (err) return done(err)
      db.listTodos('aUser', (err, todos) => {
        if (err) return done(err)
        expect(todos).to.deep.equal(
          [{
            text: 'hi',
            checked: true,
            id: 0
          }])
        done()
      })
    })
  })

  it("should uncheck a checked item", (done) => {
    db.markTodo('aUser', 0, (err) => {
      if (err) return done(err)
      db.markTodo('aUser', 0, (err) => {
        if (err) return done(err)
        db.listTodos('aUser', (err, todos) => {
          if (err) return done(err)
          expect(todos).to.deep.equal(
            [{
              text: 'hi',
              checked: false,
              id: 0
            }])
          done()
        })
      })
    })
  })

  it("shouldn't touch other items", (done) => {
    db.addTodo('aUser', 'bye', 1, (err) => {
      db.markTodo('aUser', 1, (err) => {
        if (err) return done(err)
        db.listTodos('aUser', (err, todos) => {
          if (err) return done(err)
          expect(todos).to.deep.equal(
            [{
              text: 'hi',
              id: 0
            }, {
              text: 'bye',
              checked: true,
              id: 1
            }])
          done()
        })
      })
    })
  })
})

describe("renameTodo", function () {
  beforeEach((done) =>
    db.addTodo('aUser', 'hi', 0, done))

  it("should rename an unchecked item", (done) => {
    db.renameTodo('aUser', 'bye', 0, (err) => {
      db.listTodos('aUser', (err, todos) => {
        if (err) return done(err)
        expect(todos).
        to.deep.equal([{
          text: 'bye',
          id: 0
        }])
        done()
      })
    })
  })

  it("shouldn't touch other items", (done) => {
    db.addTodo('aUser', 'bye', 1, (err) => {
      db.renameTodo('aUser', 'aye', 0, (err) => {
        db.listTodos('aUser', (err, todos) => {
          if (err) return done(err)
          expect(todos).to.deep.equal([{
            text: 'aye',
            id: 0
          }, {
            text: 'bye',
            id: 1
          }])
          done()
        })
      })
    })
  })
})

describe("listTodo", function () {
it("should list an empty list from the beginning", (done) => {
  db.listTodos('aUser', (err, todos) => {
    if (err) return done(err)
    expect(todos).to.deep.equal([])
    done()
  })
})
})
})

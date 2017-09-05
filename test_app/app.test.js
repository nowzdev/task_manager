const expect=require("expect");
const request=require("supertest");
const {app,tasks,users}=require("./../app.js");
const {ObjectID}=require("mongodb");
const bcrypt=require("bcryptjs");
const {task,populateTodods,Users,populateUsers}=require("./seed/seed");
beforeEach(populateUsers);

beforeEach(populateTodods);
describe("Tasks Validation",()=>{
  describe("POST /tasks/add (Add Task)",()=>{
  it("should return 200 and put it throw the database if the data is valid",(done)=>{
      var task={task:"TEST TASK"};
      request(app)
      .post("/tasks/add")
      .set("x-auth",Users[0].tokens[0].token)
      .send(task)
      .expect(200)
      .expect((req)=>{
        expect(req.body.task).toBe(task.task);
      })
      .end((err,res)=>{
        if(err){
          return done(err)
        }
        tasks.find({}).then((result)=>{
          expect(result.length).toBe(3);
          done()
        }).catch((e)=>{
          done(e)
        })
      })
  })
 it("should return 400 anad not put the data throw the database if the data is unvalid)",(done)=>{
   var task={task:"a"};
      request(app)
      .post("/tasks/add")
      .send(task)
      .set("x-auth",Users[0].tokens[0].token)
      .expect(400)
      .end((err,res)=>{
        if(err){
          return done(err)
        }
        tasks.find({}).then((result)=>{
          expect(result.length).toBe(2);
          done();
        }).catch((e)=>{
          return done(e)
        })
      })
  })
  })
  describe("GET /tasks/find/id (find a tasks by Id)",()=>{
  it("should return 200 and the data if the id is valid and in database",(done)=>{
    request(app)
    .get(`/tasks/find/${task[0]._id.toHexString()}`)
    .set("x-auth",Users[0].tokens[0].token)
    .expect(200)
    .expect((req)=>{
      expect(req.body.task).toBe(task[0].task);
    })
    .end(done)
  })
  it("should return 404 and the data Created by other User",(done)=>{
    request(app)
    .get(`/tasks/find/${task[0]._id.toHexString()}`)
    .set("x-auth",Users[1].tokens[0].token)
    .expect(404)
    .end(done)
  })
  it("should return 404 if the id is valid and not found in database",(done)=>{
    request(app)
    .get(`/tasks/find/${new ObjectID().toHexString()}`)
    .set("x-auth",Users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })
  it("should return 400 if the id is unvalid",(done)=>{
    request(app)
    .get("/tasks/find/123")
    .set("x-auth",Users[0].tokens[0].token)
    .expect(400)
    .end(done)
  })
    })
  describe("GET /tasks/remove/id (remove a task by id)",()=>{
    it("should return 200 and remove the data from the database if the id is valid and in the database",(done)=>{
    request(app)
    .delete(`/tasks/remove/${task[0]._id.toHexString()}`)
    .set("x-auth",Users[0].tokens[0].token)
    .expect(200)
    .expect((req)=>{
      expect(req.body.task).toBe(task[0].task)
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      tasks.find(task[0]).then((result)=>{
        expect(result.length).toBe(0);
        done();
      }).catch((e)=>{
        done(e)
      })
    })
    })
    it("should return 404 and remove the data from the database if the id is valid and in the database",(done)=>{
    request(app)
    .delete(`/tasks/remove/${task[0]._id.toHexString()}`)
    .set("x-auth",Users[1].tokens[0].token)
    .expect(404)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      tasks.find(task[0]).then((result)=>{
        expect(result.length).toBe(1);
        done();
      }).catch((e)=>{
        done(e)
      })
    })
    })
    it("should return 404 if the id is not in the database",(done)=>{
      var id=new ObjectID().toHexString();
      request(app)
       .delete(`/tasks/remove/${id}`)
       .set("x-auth",Users[0].tokens[0].token)
       .expect(404)
       .end((err,res)=>{
         if(err){
           return done(err)
         }
         tasks.findById(id).then((val)=>{
           expect(val).toNotExist();
           done();
         }).catch((e)=>{
           done(e)
         })
       })
    })
    it("should return 400 if the id is unvalid",(done)=>{
      request(app)
      .delete("/tasks/remove/123")
      .set("x-auth",Users[0].tokens[0].token)
      .expect(400)
      .end(done)
    })
  })
  describe("PATCH /tasks/update/id (Update the data in database by id)",()=>{
    it("should update the task with Completed=true if the data and the id is valid and filled CompletedAt",(done)=>{
      request(app)
      .patch(`/tasks/update/${task[0]._id.toHexString()}`)
      .set("x-auth",Users[0].tokens[0].token)
      .send({task:"Updated todos1",Completed:true})
      .expect(200)
      .expect((req)=>{
        expect(req.body.task).toBe("Updated todos1")
        expect(req.body.Completed[0]).toBe(true)
        expect(req.body.CompletedAt[0]).toBeA("string")
      })
      .end(done)
    })
    it("should update the task with Completed=true if the data and the id is valid and filled CompletedAt",(done)=>{
      request(app)
      .patch(`/tasks/update/${task[1]._id.toHexString()}`)
      .set("x-auth",Users[0].tokens[0].token)
      .send({task:"Updated todos1",Completed:true})
      .expect(404)
      .end(done)
    })
    it("should update the task with Completed=false if the data and the id is valid and filled CompletedAt and don't filled the CompletedAt",(done)=>{
      request(app)
      .patch(`/tasks/update/${task[1]._id.toHexString()}`)
      .set("x-auth",Users[1].tokens[0].token)
      .send({task:"Updated todos2",Completed:false})
      .expect((req)=>{
        expect(req.body.task).toBe("Updated todos2")
        expect(req.body.Completed[0]).toBe(false)
        expect(req.body.CompletedAt[0]).toNotExist()
      })
      .end(done)
    })
  })
})
describe("Validation User",()=>{
  describe("GET /users/me (Find Users By token code)",()=>{
  it("GET /users/me should return empty object and 401 if the authenticate code wrong",(done)=>{
    request(app)
    .get("/users/me")
    .set("x-auth","123")
    .expect(401)
    .expect((req)=>{
      expect(req.body).toEqual({});
    })
    .end(done)
  })
  it("GET /users/me should return user if the authenticate code correct",(done)=>{
    request(app)
    .get("/users/me")
    .set("x-auth",Users[0].tokens[0].token)
    .expect(200)
    .expect((req)=>{
      expect(req.body._id).toBe(Users[0]._id.toHexString())
      expect(req.body.email).toBe(Users[0].email);
    })
    .end(done)
  })
})
   describe("POST /users/add (Add users)",()=>{
     it("should Create a user if the request is valid",(done)=>{
       var email="samiowz123@gmail.com";
       var password="12334566cxv";
       request(app)
       .post("/users/add")
       .send({email,password})
       .expect(200)
       .expect((req)=>{
         expect(req.body.email).toBe(email);
         expect(req.headers["x-auth"]).toExist()
        //  expect(req.body.password).toBe(bcrypt.password)
       })
       .end((err)=>{
         if(err){
           return done(err);
         }
         users.findOne({email}).then((User)=>{
           expect(User).toExist();
           expect(User.password).toNotBe(password);
           done();
         })
       })
     })
     it("should return 400 if the request is Invalid",(done)=>{
         var email="saminowz";
         var password="ssssssssssssss";
        request(app)
        .post("/users/add")
        .send({email,password})
        .expect(400)
        .end(done)
     })
     it("should return 400 if the email is taken",(done)=>{
       var email="1959.sami.1959@gmail.com";
       var password="ssssssssssssss";
      request(app)
      .post("/users/add")
      .send({email,password})
      .expect(400)
      .end(done)
     })
   })
   describe("Post /users/login (login to user)",()=>{
     it("should login and return auth token",(done)=>{
        request(app)
        .post("/users/login")
        .send({email:Users[1].email,password:Users[1].password})
        .expect(200)
        .expect((res)=>{
          expect(res.headers["x-auth"]).toExist()
        })
        .end((err,res)=>{
          if(err){
            return done(err);
          }
          users.findById(Users[1]._id).then((result)=>{
            expect(result.tokens[1]).toInclude({access:"auth",token:res.headers["x-auth"]});
            done()
          }).catch((e)=> done(e))
        })
     })
     it("should reject invalid users",(done)=>{
       request(app)
       .post("/users/login")
       .send({email:Users[1].email,password:"22"})
       .expect(404)
       .expect((res)=>{
         expect(res.headers["x-auth"]).toNotExist()
       })
       .end((err,res)=>{
         if(err){
           return done(err);
         }
         users.findById(Users[1]._id).then((result)=>{
           expect(result.tokens.length).toBe(1)
           done();
         }).catch((e)=> done(e))
       })
     })
   })
   describe("Post /users/me/token (logout from user)",()=>{
     it("test",(done)=>{
     request(app)
     .delete("/users/me/token")
     .set("x-auth",Users[0].tokens[0].token)
     .expect(200)
     .end((err,res)=>{
       if(err){
         return done(err);
       }
       users.findById(Users[0]._id).then((result)=>{
         expect(result.tokens.length).toBe(0);
         done();
       }).catch((e)=>{
         done(e)
       })
     })
     })
   })
})

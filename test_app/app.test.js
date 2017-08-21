const expect=require("expect");
const request=require("supertest");
const {app,tasks}=require("./../app.js");
var task={
  task:"Test Task"
}
describe("Tasks Validation",()=>{
  it("POST /tasks/add (Add Task)",(done)=>{
      request(app)
      .post("/tasks/add")
      .send(task)
      .expect(200)
      .expect((req)=>{
        expect(req.body.task).toBe(task.task);
      })
      .end(done)
  })
})

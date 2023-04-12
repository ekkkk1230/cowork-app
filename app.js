const express = require('express');

const app = express();

//let members = require('./members');
//const db = require('./models/index');
const db = require('./models');
const { Member } = db;

app.use(express.json()); //미들웨어 => 서버로 오는 모든 리퀘스트에 관해 필요한 처리를 해주는 함수
// 리퀘스트가 들어오게 되면 middleware에 의해
// 바디에 있는 JSON 데이터가 req 객체의 body 프로퍼티에 설정
// 리퀘스트의 패스와 메서드를 보고 알맞은 라우트 핸들러가 호출됨

app.get('/api/members', async (req, res) => {
    const { team } = req.query;
    if (team) {
        //const teamMembers = await Member.findAll({ where: { team } });
        //findAll({ where : 특정값 }) 특정값을 가진 row만 조회
        const teamMembers = await Member.findAll({ 
            where: {team},
            order: [
                ['admissionDate','DESC']
            ]
        });
        res.send(teamMembers);
    } else {
        const members = await Member.findAll();
        // 전체 직원 정보 조회 findAll() => Members테이블의 모든 정보를 가져와서 조회할 수 있음.
        // 모델이 가진 메소드들은 비동기 실행함수
        res.send(members);
    }
    // res.send(members);
});


app.get('/api/members/:id', async (req, res) => {
    /* :id => 가변적인 값을 id에 담는다.
        Route Parameter 가변적인 값이 전달되는 부분에 사용
    */
   // const id = req.params.id;
   const { id } = req.params;
   //const member = await members.find(m => m.id === Number(id));
   // 라우트 파라미터의 id 값은 String 이어서 Number 함수를 이용해 숫자열로 변환

   //특정 직원 정보 조회하기
   const member = await Member.findOne({ where: {id} });
   if (member) {
        res.send(member);
   } else {
        res.status(404).send({ message : 'There is no member with the id' }); // response의 상태코드 404 변환
   }
});

app.post('/api/members', async (req, res) => {
    //const newMember = req.body;
    //members.push(newMember);
    //res.send(newMember);

    const newMember = req.body;
    //const member = Member.build(newMember);
    //await member.save();
    const member = await Member.create(newMember);
    res.send(member);
});

/* app.put('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const newInfo = req.body;
    // const member = members.find(m => m.id === Number(id));
    //if (member) {
    //    Object.keys(newInfo).forEach(prop => {
        //        member[prop] = newInfo[prop];
        //    });
        //    res.send(member);
        //} else {
            //    res.status(404).send({ message: 'There is no member with the id!' });
        //}
    const result = await Member.update(newInfo, { where: { id } });
    if (result[0]) {
        res.send({ message: `${result[0]} row(s) affected` });
    } else {
        res.status(404).send({ message: 'There is no member with the id!' });
    }
}); */
app.put('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const newInfo = req.body;
    const member = await Member.findOne({ where : { id } });
    if (member) {
        Object.keys(newInfo).forEach(prop => {
            member[prop] = newInfo[prop];
        });
        await member.save();
        res.send(member);
    } else {
        res.status(404).send({ message: 'Threr is no member with the id!' });
    };
});

app.delete('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    //const memberCount = members.length;
    //members = members.filter(member => member.id !== Number(id));
    //if(members.length < memberCount) {
    //    res.send({ message : 'Deleted' });
    //} else {
    //    res.status(404).send({ message: 'There is no member with the id!' });
    //}

    const deletedCount = await Member.destroy({ where: {id} });
    if (deletedCount) {
        res.send({ message: `${deletedCount} row(s) deleted` });
    } else {
        res.status(404).send({ message: `There is no member with the id!` });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('서버 실행중...');
});

/* 
GET 리소스 조회
POST 새로운 리소스 추가
PUT 기존 리소스 수정
DELETE 기존 리소스 삭제
*/
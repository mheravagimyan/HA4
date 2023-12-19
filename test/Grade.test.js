const { expect } = require("chai");
const { ethers, web3, Web3 } = require("hardhat");

describe("Grade", function() {
  let professor;
  let grade;
  async function countGrades(_student, arr) {
    let final_grade;
    let intermediate = Math.min(Math.round((Math.max(arr[0] + arr[1], 2 * arr[6]) + arr[2] + arr[3] + arr[4] + arr[5]) / 6),10);
    if (arr[7] > 0) {
      final_grade = Math.min(Math.round(0.4 * intermediate + 0.6 * arr[7]), 10);
    } else {
      final_grade = intermediate >= 6 ? intermediate : 0;
    }
    return final_grade;
  }
  
  beforeEach(async function () {  

    [professor, student1, student2, student3] = await ethers.getSigners();
    const  Grade = await ethers.getContractFactory("Grade", professor);
    grade = await Grade.deploy();
    await grade.waitForDeployment();
    await grade.setGrades(student1.address, [6, 7, 8, 9, 5, 6, 7, 9]); 
  });

  describe("Grade", function () {
    it("Should be possible to add student!", async function () {
      let studentsCountBefore = await grade.getStudentsCount();
      await grade.addStudents([student2.address, student3.address]);
      let studentsCountAfter= await grade.getStudentsCount();

      expect(studentsCountBefore).to.eq(BigInt("1"));
      expect(studentsCountAfter).to.eq(BigInt("3"));

    });

    it("Should be possible to remove student!", async function () {
      let studentsCountBefore = await grade.getStudentsCount();
      await grade.removeStudent(student1.address);
      let studentsCountAfter= await grade.getStudentsCount();
      expect(studentsCountBefore).to.eq(BigInt("1"));
      expect(studentsCountAfter).to.eq(BigInt("0"));
    });

    it("Should be possible to compute final grade!", async function () {
      await grade.setGrades(student2.address, [6, 7, 8, 9, 5, 6, 7, 6]); 
      await grade.setGrades(student3.address, [2, 1, 0, 5, 5, 3, 4, 5]); 
      await grade.computeFinalGrade();

      let st1Grade = await countGrades(student1.address, [6, 7, 8, 9, 5, 6, 7, 9]);
      let st2Grade = await countGrades(student2.address, [6, 7, 8, 9, 5, 6, 7, 6]);
      let st3Grade = await countGrades(student3.address, [2, 1, 0, 5, 5, 3, 4, 5]);

      expect(await grade.getStudentFinalGrade(student1.address)).to.eq(st1Grade);
      expect(await grade.getStudentFinalGrade(student2.address)).to.eq(st2Grade);
      expect(await grade.getStudentFinalGrade(student3.address)).to.eq(st3Grade);
    });

    it("Should be reverted when the caller is not professor!", async function () {
      let tx = grade.connect(student1).addStudents([student2.address]);
      await expect(tx).to.be.revertedWith("Only professor can add student!");
    });

    it("Should be emited with correct args!", async function () {
      let tx1 = grade.addStudents([student1.address, student2.address]);
      let tx2 = grade.removeStudent(student1.address);
      await expect(tx1)
        .to.emit(grade, "AddStudents")
        .withArgs([student1.address, student2.address]);
      await expect(tx2)
        .to.emit(grade, "RemoveStudent")
        .withArgs(student1.address);
    });
  });
});
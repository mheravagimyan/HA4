// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract Grade {
    address professor;
    address[] students;
    mapping(address => uint[8]) assignGrades;
    mapping(address => uint) finalGrades;

    event AddStudents(address[] _students);
    event RemoveStudent(address _student);

    constructor () {
        professor = msg.sender;
    }

    /**
     * @dev function for grades student
     * @param _student the want student
     * @param _grades grades[8] are HA1, ..., HA6, ExamTerm1, ExamFinal.
     */
    function setGrades(address _student, uint[8] memory _grades) external {
        if(!isStudentInList(_student)){
            students.push(_student);
        }
        assignGrades[_student] = _grades;
    }

    /**
     * @dev To get students count
     */
    function getStudentsCount() view external returns(uint) {
        return students.length;
    }
    
    /**
     * @dev To get students final grade
     */
    function getStudentFinalGrade(address _student) view external returns(uint) {
        return finalGrades[_student];
    }

    /**
     * @dev To get students current grades
     */
    function getStudentCurrentGrades(address _student) view external returns(uint[8] memory) {
        return assignGrades[_student];
    }

    function isStudentInList(address _student) public view returns(bool) {
        for(uint i; i < students.length; i++) {
            if(students[i] == _student){
                return true;
            }
        }
        return false;
    }

    /**
     * @dev This function allowes professor to add student
     * @param _students that should be added
     */
    function addStudents(address[] calldata _students) external{
        require(msg.sender == professor, "Only professor can add student!");
        for(uint i; i < _students.length; ++i){
            students.push(_students[i]);
        }

        emit AddStudents(_students);
    }

    /**
     * @dev This function allowes professor to remove student
     * @param _student that should be removed
     */
    function removeStudent(address _student) external{
        require(msg.sender == professor, "Only professor can remove student!");
        uint len = students.length;
        for(uint i; i < len; ++i){
            if(students[i] == _student) {
                students[i] = students[len - 1];
                students.pop();
                delete assignGrades[_student];
                break;
            }
        }

        emit RemoveStudent(_student);
    }

//  Intermediate=min(round((max(HA1 +HA2, 2 * ExamTerm1) + HA3 + HA4 + HA5 + HA6) / 6),10)
//  If ExamFinal > 0:
//      final_grade = min(round(0.4 * Intermediate + 0.6 * ExamFinal), 10),
//  Else:
//      final_grade = Intermediate * I(Intermediate >= 6), where I(true) = 1 and I(false) = 0 
    /**
     * @dev This function allowes professor to compute final grades.
     * Only professor can call this function
     */
    function computeFinalGrade() external {
        require(msg.sender == professor, "Only professor can compute final grades!");

        for(uint i; i < students.length; ++i) {
            uint compute = (
                assignGrades[students[i]][2] + assignGrades[students[i]][3] + assignGrades[students[i]][4] + assignGrades[students[i]][5] + 
                (assignGrades[students[i]][0] + assignGrades[students[i]][1] > 2 * assignGrades[students[i]][6] ? 
                    assignGrades[students[i]][0] + assignGrades[students[i]][1] : 2 * assignGrades[students[i]][6]) + 
                3
            ) / 6;
            uint intermediate = compute < 10 ? compute : 10;
            if(assignGrades[students[i]][7] > 0) {
                uint temp = (intermediate * 4 + assignGrades[students[i]][7] * 6 + 5) / 10;
                finalGrades[students[i]] = temp < 10 ? temp : 10;
                
            } else {
                finalGrades[students[i]] = intermediate >= 6 ? intermediate : 0; 
            }
        }
    }

    
    
}
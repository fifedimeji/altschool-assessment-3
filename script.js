// STUDENT/GRADE CLASS
class studentGrade {
    constructor(name, grade, matricno) {
        this.name = name;
        this.grade = grade;
        this.matricno = matricno;
    }
}

// UI CLASS
class UI {
    static displayStudents() {
        const storedGrades = Store.getStudents()

        const grades = storedGrades;

        grades.forEach((grade) => UI.addStudentToList(grade));
    }

    static addStudentToList(grade) {
        const list = document.querySelector('#student-grade-list')
        const row = document.createElement('tr')

        row.setAttribute('data-grade', grade.grade);

        row.innerHTML = `
            <td>${grade.name}</td>
            <td>${grade.grade}</td>
            <td>${grade.matricno}</td>
            <td><a href="#" class="delete-btn delete">Delete</a></td>
        `;

        list.appendChild(row);
    }

    static deleteStudent(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }

    static updateAverage() {
        const students = Store.getStudents();
        const avgDisplay = document.querySelector('#average-grade');
        const rows = document.querySelectorAll('#student-grade-list tr');

        if (students.length === 0) {
            avgDisplay.textContent = "0";
            return;
        }

        const total = students.reduce((acc, curr) => acc + Number(curr.grade), 0);
        const average = (total / students.length).toFixed(2);

        avgDisplay.textContent = average;

        rows.forEach(row => {
            const grade = parseFloat(row.getAttribute('data-grade'));
            if (grade > average) {
                row.classList.add('above-avg');
            } else {
                row.classList.remove('above-avg');
            }
        });
    }



    static showAlert(message, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container')
        const form = document.querySelector('#student-form')
        container.insertBefore(div, form)

        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields() {
        document.querySelector('#name').value = ''
        document.querySelector('#grade').value = ''
        document.querySelector('#matricno').value = ''
    }
}
// STORAGE CLASS
class Store {
    static getStudents() {
        let students
        if (localStorage.getItem('students') === null) {
            students = []
        } else {
            students = JSON.parse(localStorage.getItem('students'))
        }

        return students;
    }

    static addStudent(student) {
        const students = Store.getStudents()

        students.push(student)

        localStorage.setItem('students', JSON.stringify(students))
    }

    static removeStudent(matricno) {
        const students = Store.getStudents()

        students.forEach((student, index) => {
            if (student.matricno === matricno) {
                students.splice(index, 1)
            }
        })

        localStorage.setItem('students', JSON.stringify(students))
    }
}
// EVENT: DISPLAY STUDENT/GRADE
document.addEventListener('DOMContentLoaded', UI.displayStudents)
// EVENT: ADD A STUDENT/GRADE
document.querySelector('#student-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('#name').value
    const grade = document.querySelector('#grade').value
    const matricno = document.querySelector('#matricno').value

    if (name === '' || grade === '' || matricno === '') {
        UI.showAlert('Please fill in all fields', 'failure')
    } else {

        const student = new studentGrade(name, grade, matricno)

        UI.addStudentToList(student)

        Store.addStudent(student)

        UI.showAlert('Grade Added', 'success')

        UI.clearFields()

        UI.updateAverage()
    }
})
// EVENT: DELETE A STUDENT/GRADE
document.querySelector('#student-grade-list').addEventListener('click', (e) => {
    UI.deleteStudent(e.target)

    Store.removeStudent(e.target.parentElement.previousElementSibling.textContent)

    UI.showAlert('Book Removed', 'success')

    UI.updateAverage()
})
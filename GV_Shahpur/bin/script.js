$(document).ready(function() {
    // Demo result data - extended for exams
    const demoResults = {
        '12345': {
            name: 'Rahul Sharma',
            class: 'Class 10',
            exam: 'Annual exam',
            totalMarks: '482/500',
            percentage: '96.4%',
            grade: 'A1',
            subjects: [
                {name: 'Mathematics', marks: '98/100'},
                {name: 'Science', marks: '96/100'},
                {name: 'English', marks: '95/100'},
                {name: 'Hindi', marks: '96/100'},
                {name: 'Social Science', marks: '97/100'}
            ]
        },
        '67890': {
            name: 'Priya Singh',
            class: 'Class 8',
            exam: 'Half yearly',
            totalMarks: '388/400',
            percentage: '97%',
            grade: 'A1',
            subjects: [
                {name: 'Mathematics', marks: '98/100'},
                {name: 'Science', marks: '97/100'},
                {name: 'English', marks: '96/100'},
                {name: 'Hindi', marks: '95/100'},
                {name: 'Social Science', marks: '98/100'}
            ]
        }
        // Add more demo data
    };

    $('#resultForm').on('submit', function(e) {
        e.preventDefault();
        
        const admissionNo = $('#admissionNo').val().trim();
        const classSelect = $('#classSelect').val();
        const examSelect = $('#examSelect').val();  // NEW: Exam validation
        
        if (!admissionNo || !classSelect || !examSelect) {
            alert('Please fill all fields: Class, Exam, and Admission Number');
            return;
        }

        // Demo logic - check for exact match first, else generate
        let result = demoResults[admissionNo];
        if (!result || result.class !== classSelect || result.exam !== examSelect) {
            result = generateRandomResult(classSelect, examSelect, admissionNo);
        }
        
        displayResult(result);
    });

    function generateRandomResult(className, examType, admissionNo) {
        const names = ['Amit Kumar', 'Riya Patel', 'Arjun Yadav', 'Sneha Gupta', 'Vikash Singh', 'Neha Sharma'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        
        // Vary results slightly by exam type
        let totalMarks, percentage, grade;
        switch(examType) {
            case 'Pre - mid 1':
            case 'Pre - mid 2':
                totalMarks = '92/100'; percentage = '92%'; grade = 'A2'; break;
            case 'Half yearly':
                totalMarks = '388/400'; percentage = '97%'; grade = 'A1'; break;
            case 'Post mid':
                totalMarks = '465/500'; percentage = '93%'; grade = 'A1'; break;
            default: // Annual exam
                totalMarks = '482/500'; percentage = '96.4%'; grade = 'A1'; break;
        }
        
        return {
            name: randomName,
            class: className,
            exam: examType,
            totalMarks,
            percentage,
            grade,
            subjects: [
                {name: 'Mathematics', marks: '95/100'},
                {name: 'Science', marks: '93/100'},
                {name: 'English', marks: '92/100'},
                {name: 'Second Language', marks: '92/100'},
                {name: 'Social Science', marks: '93/100'}
            ],
            admissionNo
        };
    }

    function displayResult(result) {
        let tableHtml = `
            <div class="text-center mb-4">
                <h4><strong>${result.name}</strong></h4>
                <p>Admission No: ${result.admissionNo}</p>
                <p>Class: ${result.class}</p>
                <p><strong>Exam: ${result.exam}</strong></p>
                <h5>Total: ${result.totalMarks} (${result.percentage}) - Grade: <span class="badge badge-success">${result.grade}</span></h5>
            </div>
            <table class="table table-bordered table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>Subject</th>
                        <th>Marks Obtained</th>
                        <th>Maximum Marks</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        result.subjects.forEach(subject => {
            const [obtained, max] = subject.marks.split('/');
            tableHtml += `
                <tr>
                    <td>${subject.name}</td>
                    <td><strong>${obtained}</strong></td>
                    <td>${max}</td>
                </tr>
            `;
        });
        
        tableHtml += `
                </tbody>
            </table>
            <div class="text-center mt-3">
                <p class="text-muted">This is a demo result. Contact school for official results.</p>
            </div>
        `;
        
        $('#resultContent').html(tableHtml);
        $('#resultModal').modal('show');
    }
});

function printResult() {
    const printContent = document.getElementById('resultModal').querySelector('.modal-body').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
}


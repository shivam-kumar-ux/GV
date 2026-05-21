/**
 * Default website content (used before Firebase is configured or as fallback).
 * Admin panel "Import current website data" writes this to Firestore.
 */
window.GV_DEFAULT_CONTENT = {
  achievers: [
    { name: "Sunny Kumar", class: "", exam: "CBSE Class 10", rank: "", achievement: "Rank 1 - Board Exam", photo: "img/result/sunny.JPG", details: [{ label: "Exam", value: "CBSE Class 10" }, { label: "Achievement", value: "School Topper" }] },
    { name: "Supriya Rani", class: "", exam: "CBSE Class 10", rank: "", achievement: "School Topper", photo: "img/result/supriya.JPG", details: [{ label: "Exam", value: "CBSE Class 10" }, { label: "Achievement", value: "Girl's Topper" }] },
    { name: "Anjali Kumari", class: "VI", exam: "Simultala Awasiya Vidyalaya", rank: "", achievement: "Class - VI", photo: "img/result/anjali.JPG", details: [{ label: "Exam", value: "Simultala Awasiya Vidyalaya" }, { label: "Exam", value: "Sainik School - Bihar state girls topper" }, { label: "Exam", value: "Banasthali Vidyapith Entrance Exam 2025" }] },
    { name: "Ankit Kumar", class: "VI", exam: "RMS Ajmer", rank: "179", achievement: "Class - VI", photo: "img/result/ankit.JPG", details: [{ label: "Exam", value: "RMS Ajmer" }, { label: "Exam", value: "Sainik School" }, { label: "Rank", value: "179" }] },
    { name: "Kanhaiya Jee", class: "", exam: "Sainik School", rank: "", achievement: "State Topper", photo: "img/result/kanhaiya.JPG", details: [{ label: "Exam", value: "2024-Jharkhand State Topper, Sainik School Telaiya and SOF Olympiads zonal winner" }] },
    { name: "Pawan Kumar", class: "VI", exam: "RMS Ajmer", rank: "", achievement: "RMS Topper", photo: "img/result/pawan.JPG", details: [{ label: "Exam", value: "RMS Ajmer and Simultala Awasiya Vidyalaya, Class - VI" }] },
    { name: "Roushan Kr Yadav", class: "", exam: "Sainik School", rank: "", achievement: "State Topper", photo: "img/result/roushan.JPG", details: [{ label: "Exam", value: "Jharkhand state topper in Sainik School Telaiya - 2023" }] },
    { name: "Shivam Kumar", class: "IX", exam: "Sainik School Entrance Exam - 2025", rank: "AIR 113", achievement: "Sainik School Topper", photo: "img/result/shivam.JPG", details: [{ label: "Exam", value: "Sainik School Entrance Exam - 2025" }, { label: "Rank", value: "AIR 113" }, { label: "Marks Scored", value: "368/400" }, { label: "Class", value: "IX" }] },
    { name: "Shivansh Singh", class: "", exam: "Sainik School", rank: "", achievement: "State Topper", photo: "img/result/shivansh.jpg", details: [{ label: "Exam", value: "Bihar State Topper in Sainik School Entrance Exam, RIMC Dehradun, Selected for Sainik School Gopalganj, RMS Bengaluru and SOF Olympiads" }] },
    { name: "Yash Raj", class: "VI", exam: "Sainik School Entrance Exam", rank: "AIR 58", achievement: "2025 Jharkhand State Topper", photo: "img/result/yash.jpg", details: [{ label: "Exam", value: "Sainik School Entrance Exam" }, { label: "Rank", value: "AIR 58" }, { label: "Marks Scored", value: "292/300" }, { label: "Class", value: "VI" }] }
  ],
  alumni: [
    { name: "Raushan Kumar", achievement: "manager at SBI", photo: "img/alumni/team-1.jpg" },
    { name: "Raushan Kumar", achievement: "manager at SBI", photo: "img/alumni/team-2.jpg" },
    { name: "Raushan Kumar", achievement: "manager at SBI", photo: "img/alumni/team-3.jpg" },
    { name: "Raushan Kumar", achievement: "manager at SBI", photo: "img/alumni/team-4.jpg" }
  ],
  programs: [
    { title: "Nursery", ageLabel: "Age 3+ Years", description: "Foundation years focusing on basic learning and motor skills.", icon: "fa-child", iconBg: "bg-primary", routineUrl: "docs/Routine/R_Nursery.pdf", syllabusUrl: "docs/Syllabus/S_Nursery.pdf" },
    { title: "LKG & UKG", ageLabel: "Age 4-5 Years", description: "Preparing children for formal schooling with basic academics and activities.", icon: "fa-school", iconBg: "bg-secondary", routineUrl: "docs/Routine/R_LKG & UKG.pdf", syllabusUrl: "docs/Syllabus/S_LKG & UKG.pdf" },
    { title: "Class 1-5 (Primary)", ageLabel: "Age 6-10 Years", description: "Building strong foundation with core subjects and activities.", icon: "fa-book", iconBg: "bg-warning", routineUrl: "docs/Routine/R_1-5.pdf", syllabusUrl: "docs/Syllabus/S_1-5.pdf" },
    { title: "Class 6-8 (Middle)", ageLabel: "Age 11-13 Years", description: "Comprehensive curriculum with emphasis on conceptual learning.", icon: "fa-book-reader", iconBg: "bg-success", routineUrl: "docs/Routine/R_6-8.pdf", syllabusUrl: "docs/Syllabus/S_6-8.pdf" },
    { title: "Class 9-10 (Matric)", ageLabel: "Age 14-15 Years", description: "CBSE matriculation preparation with focus on board exams.", icon: "fa-graduation-cap", iconBg: "bg-info", routineUrl: "docs/Routine/R_9-10.pdf", syllabusUrl: "docs/Syllabus/S_9-10.pdf" },
    { title: "Class 11-12 Science", ageLabel: "Age 16-17 Years", description: "PCM/PCB streams with expert faculty and lab facilities.", icon: "fa-flask", iconBg: "bg-danger", routineUrl: "docs/Routine/R_11-12_Sc.pdf", syllabusUrl: "docs/Syllabus/S_11-12_Sc.pdf" },
    { title: "Class 11-12 Commerce", ageLabel: "Age 16-17 Years", description: "Commerce stream with Accountancy, Business Studies, and Economics.", icon: "fa-calculator", iconBg: "bg-dark", routineUrl: "docs/Routine/R_11-12_Commerce.pdf", syllabusUrl: "docs/Syllabus/S_11-12_Commerce.pdf" }
  ],
  resultsByYear: {
    "2025": {
      stats: { selections: 32, exams: 7, toppers: 10 },
      exams: [
        { name: "CBSE 10th Board", icon: "📋", color: "#4CAF50", results: [{ rank: 1, name: "Sunny Kumar", meta: "School Topper", photo: "img/result/sunny.JPG" }, { rank: 2, name: "Supriya Rani", meta: "Girls' Topper", photo: "img/result/supriya.JPG" }, { rank: 3, name: "Rahul Kumar", meta: "94.6%", photo: "" }] },
        { name: "Sainik School", icon: "🎖️", color: "#2196F3", results: [{ rank: 1, name: "Yash Raj", meta: "AIR 58 | Cl. VI", photo: "img/result/yash.jpg" }, { rank: 2, name: "Shivam Kumar", meta: "AIR 113 | Cl. IX", photo: "img/result/shivam.JPG" }, { rank: 3, name: "Anjali Kumari", meta: "Bihar Girls Tpr", photo: "img/result/anjali.JPG" }] },
        { name: "RIMC Dehradun", icon: "🏫", color: "#9C27B0", results: [{ rank: 1, name: "Shivansh Singh", meta: "Bihar State Topper", photo: "img/result/shivansh.jpg" }] },
        { name: "RMS", icon: "⚔️", color: "#FF5722", results: [{ rank: 1, name: "Ankit Kumar", meta: "RMS Ajmer AIR 179", photo: "img/result/ankit.JPG" }, { rank: 2, name: "Pawan Kumar", meta: "RMS Ajmer", photo: "img/result/pawan.JPG" }] },
        { name: "Simultala Awasiya", icon: "🏡", color: "#00BCD4", results: [{ rank: 1, name: "Anjali Kumari", meta: "Selected", photo: "img/result/anjali.JPG" }, { rank: 2, name: "Pawan Kumar", meta: "Selected", photo: "img/result/pawan.JPG" }] },
        { name: "Navodaya (JNV)", icon: "📚", color: "#FF9800", results: [{ rank: 1, name: "Priya Kumari", meta: "Selected", photo: "" }, { rank: 2, name: "Amit Kumar", meta: "Selected", photo: "" }] },
        { name: "Netarhat", icon: "🌄", color: "#8BC34A", results: [{ rank: 1, name: "Rohit Kumar", meta: "Selected", photo: "" }] }
      ]
    },
    "2024": {
      stats: { selections: 22, exams: 6, toppers: 8 },
      exams: [
        { name: "CBSE 10th Board", icon: "📋", color: "#4CAF50", results: [{ rank: 1, name: "Ravi Shankar", meta: "Topper 96.2%", photo: "" }, { rank: 2, name: "Neha Kumari", meta: "Girls Tpr 94.8%", photo: "" }] },
        { name: "Sainik School", icon: "🎖️", color: "#2196F3", results: [{ rank: 1, name: "Kanhaiya Jee", meta: "JH State Topper", photo: "img/result/kanhaiya.JPG" }, { rank: 2, name: "Vivek Kumar", meta: "AIR 92 | Cl. VI", photo: "" }] },
        { name: "RIMC Dehradun", icon: "🏫", color: "#9C27B0", results: [{ rank: 1, name: "Aditya Raj", meta: "Selected", photo: "" }] },
        { name: "RMS", icon: "⚔️", color: "#FF5722", results: [{ rank: 1, name: "Saurabh Kumar", meta: "RMS Bengaluru", photo: "" }, { rank: 2, name: "Tushar Yadav", meta: "RMS Ajmer", photo: "" }] },
        { name: "Navodaya (JNV)", icon: "📚", color: "#FF9800", results: [{ rank: 1, name: "Deepak Kumar", meta: "Selected", photo: "" }, { rank: 2, name: "Sima Devi", meta: "Selected", photo: "" }] },
        { name: "Simultala Awasiya", icon: "🏡", color: "#00BCD4", results: [{ rank: 1, name: "Aman Kumar", meta: "Selected", photo: "" }] }
      ]
    },
    "2023": {
      stats: { selections: 21, exams: 5, toppers: 7 },
      exams: [
        { name: "CBSE 10th Board", icon: "📋", color: "#4CAF50", results: [{ rank: 1, name: "Abhishek Kumar", meta: "Topper 95.4%", photo: "" }, { rank: 2, name: "Pooja Singh", meta: "Girls Tpr 93.2%", photo: "" }] },
        { name: "Sainik School", icon: "🎖️", color: "#2196F3", results: [{ rank: 1, name: "Roushan Kr Yadav", meta: "JH State Topper", photo: "img/result/roushan.JPG" }, { rank: 2, name: "Mukesh Kumar", meta: "AIR 144", photo: "" }] },
        { name: "RMS", icon: "⚔️", color: "#FF5722", results: [{ rank: 1, name: "Sudhanshu Kumar", meta: "RMS Chail", photo: "" }] },
        { name: "Navodaya (JNV)", icon: "📚", color: "#FF9800", results: [{ rank: 1, name: "Ananya Kumari", meta: "Selected", photo: "" }, { rank: 2, name: "Rahul Paswan", meta: "Selected", photo: "" }] },
        { name: "Netarhat", icon: "🌄", color: "#8BC34A", results: [{ rank: 1, name: "Sanjay Kumar", meta: "Selected", photo: "" }] }
      ]
    }
  },
  gallery: {
    youtube: [
      { id: "REPLACE_VIDEO_ID_1", title: "Annual Function 2024 Highlights", date: "Dec 2024" },
      { id: "REPLACE_VIDEO_ID_2", title: "Result Celebration — Sainik School Toppers", date: "Apr 2025" },
      { id: "REPLACE_VIDEO_ID_3", title: "Sports Day 2024", date: "Feb 2024" }
    ],
    instagram: [
      "https://www.instagram.com/p/REPLACE_POST_ID_1/",
      "https://www.instagram.com/p/REPLACE_POST_ID_2/",
      "https://www.instagram.com/p/REPLACE_POST_ID_3/",
      "https://www.instagram.com/p/REPLACE_POST_ID_4/"
    ],
    memories: {
      "2025": [
        { title: "Annual Function 2025", icon: "🎭", date: "December 2025", photos: [{ src: "img/courses-1.jpg", caption: "Opening ceremony" }, { src: "img/courses-2.jpg", caption: "Cultural dance performance" }, { src: "img/courses-3.jpg", caption: "Prize distribution" }, { src: "img/courses-4.jpg", caption: "Drama presentation" }] },
        { title: "Result Celebration — Board & Competitive Exams", icon: "🏆", date: "April 2025", photos: [{ src: "img/result/yash.jpg", caption: "Yash Raj — Sainik School AIR 58" }, { src: "img/result/shivam.JPG", caption: "Shivam Kumar — Sainik School AIR 113" }] }
      ],
      "2024": [
        { title: "Annual Function 2024", icon: "🎭", date: "December 2024", photos: [{ src: "img/courses-1.jpg", caption: "Stage performance" }, { src: "img/courses-2.jpg", caption: "Dance competition" }] },
        { title: "Sports Day 2024", icon: "⚽", date: "February 2024", photos: [{ src: "img/courses-4.jpg", caption: "March past" }, { src: "img/courses-5.jpg", caption: "100m sprint" }] }
      ],
      "2023": [
        { title: "Annual Function 2023", icon: "🎭", date: "December 2023", photos: [{ src: "img/courses-1.jpg", caption: "Stage decoration" }, { src: "img/courses-2.jpg", caption: "Cultural dance" }] }
      ]
    }
  },
  hostel: { menuPdfUrl: "docs/hostel-menu.pdf" },
  disclosure: [
    { title: "MANDATORY PUBLIC DISCLOSURE", pdfUrl: "docs/mandatory/MANDATORY_PUBLIC_DISCLOSURE.pdf" },
    { title: "List of Management", pdfUrl: "docs/mandatory/List_of_Management.pdf" },
    { title: "Fire Safety Certificate", pdfUrl: "docs/mandatory/Fire_Safety_Certificate.pdf" },
    { title: "PTA Members", pdfUrl: "docs/mandatory/PTA_Members.pdf" },
    { title: "Academic Calendar", pdfUrl: "docs/mandatory/Academic_Calendar.pdf" },
    { title: "Fee Structure", pdfUrl: "docs/mandatory/Fee_Structure.pdf" },
    { title: "Sanitation Certificate", pdfUrl: "docs/mandatory/Sanitation_Certificate.pdf" },
    { title: "Building Safety Certificate", pdfUrl: "docs/mandatory/Building_Safety_Certificate.pdf" },
    { title: "NOC", pdfUrl: "docs/mandatory/NOC.pdf" },
    { title: "School Reg-RTE", pdfUrl: "docs/mandatory/School_Reg-RTE.pdf" },
    { title: "Copies of Society", pdfUrl: "docs/mandatory/Copies_of_Society.pdf" },
    { title: "Self Certification", pdfUrl: "docs/mandatory/Self_Certification.pdf" },
    { title: "Water Certificate", pdfUrl: "docs/mandatory/Water_Certificate.pdf" }
  ],
  notices: {
    ticker: "🚨 Breaking News: Annual Sports Day on Nov 15 | Winter Vacation from Dec 20-31 | PTM on Nov 8 | Exam Schedule Released 🚨",
    lastUpdated: "October 25, 2024",
    items: [
      { title: "Annual Examination Schedule 2024–25 Released", body: "The complete timetable for Annual Examinations (Class 1–12) has been released. Exams begin from November 4, 2024.", date: "Oct 25, 2024", category: "exam", pinned: true, isNew: true, attachments: [{ label: "Timetable PDF", url: "#", style: "primary" }] },
      { title: "Admissions Open for Session 2025–26 (Nursery to Class 10)", body: "Gyanoday Vidyalaya invites applications for the new academic session. Last date to apply: December 31, 2024.", date: "Oct 22, 2024", category: "admission", pinned: true, isNew: true, attachments: [{ label: "Download Form", url: "admission.html", style: "primary" }] },
      { title: "Annual Sports Day – November 15, 2024", body: "The Annual Sports Day will be held on November 15, 2024 at the school ground.", date: "Oct 20, 2024", category: "event", pinned: false, isNew: false, attachments: [] },
      { title: "Parent-Teacher Meeting (PTM) – November 8, 2024", body: "PTM for all classes will be held on November 8, 2024 from 9:00 AM to 12:00 PM.", date: "Oct 18, 2024", category: "event", pinned: false, isNew: false, attachments: [] },
      { title: "Winter Vacation: December 20 – December 31, 2024", body: "School will remain closed for Winter Vacation. Classes resume January 2, 2025.", date: "Oct 15, 2024", category: "holiday", pinned: false, isNew: false, attachments: [] }
    ]
  }
};

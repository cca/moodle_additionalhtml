(function($) {
    let d = document
    // if we're logged in on the user profile page
    if (location.pathname.match('/user/profile.php') && !d.querySelector('.usermenu').textContent.match('You are not logged in.')) {
        // show an alert asking people to contact the Help Desk
        let showAlert = () => {
            let warning = d.createElement('section')
            warning.classList.add('node_category', 'alert', 'alert-warning')
            warning.innerHTML = `<div>
                <h3>Not enrolled in any courses</h3>
                <p>
                    You're not enrolled in any active courses. If you believe this is a mistake, please contact the CCA Help Desk by <a href="mailto:helpdesk@cca.edu?Dropped+from+Moodle+enrollments">emailing helpdesk@cca.edu</a>, calling 510.594.5010, or filling out <a href="https://technology.cca.edu/help/submit">an online form</a>. Please tell them that you received this message.
                </p>
            </div>`
            d.querySelector('.profile_tree').prepend(warning)
        }
        // record that this happened in Google Analytics
        let recordEvent = (course_list) => {
            // data: (when, what page are automatic) whom, course list
            let name = d.querySelector('.page-header-headings h1').textContent
            // course_list is a nodelist, convert to array & then comma-separated string
            let courses = Array.from(course_list).map(el => el.textContent).join(', ')
            ga('send', 'event', 'test - Dropped Enrollments', name, courses)
        }

        // are there any enrollments? if no, show the alert & record data
        Array.from(d.querySelectorAll('dd')).forEach(el => {
            if (el.children && el.children[0].tagName === 'UL') {
                let course_list = el.children[0].querySelectorAll('li')
                let num_courses = course_list.length
                let hidden_courses = el.children[0].querySelectorAll('li.dimmed').length
                // there are no unhidden (i.e. active) courses
                if ((num_courses - hidden_courses) < 1) {
                    showAlert()
                    // pass course list to fn so we don't have to find it twice
                    recordEvent(course_list)
                }
            }
        })

    }
    // if no enrollments then show message saying this is known problem, report to Help Desk
    // and sometimes waiting & logging back in later fixes the issue
})(jQuery)

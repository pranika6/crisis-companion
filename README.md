# Crisis Companion 
### Volunteer Support & Intergenerational Coordination Platform

**Crisis Companion** is a Python-powered platform designed to bridge the gap between young volunteers and senior citizens. The system facilitates real-time assistance during emergencies and provides a framework for ongoing social support to combat elderly isolation.

---

## Project Overview 
The project was born from the need to address the vulnerability of senior citizens during public health crises or natural disasters. While many young people are willing to help, the lack of a structured coordination system often leads to inefficient response times and missed requests.

**Crisis Companion** solves this by acting as a centralized dispatch and matching engine. 
* **The Problem:** During a crisis, seniors often struggle with "last-mile" needs—such as grocery delivery, medication pickup, or basic tech support—while volunteers lack a verified way to identify who needs help nearby.
* **The Solution:** A dual-portal system where seniors (or their caregivers) can post specific "Help Requests" and volunteers can browse, accept, and track these tasks based on proximity and urgency.
* **Impact:** By digitizing the coordination process, the platform reduces response latency and builds a "resilience map" of the community, ensuring no senior is left unsupported.

---

##  Features
* **Dual-User Portals:** Custom interfaces for Volunteers (to view tasks) and Seniors (to request help).
* **Intelligent Request Matching:** Matches volunteers with nearby seniors based on location and specific needs (e.g., medical vs. logistics).
* **Real-Time Status Tracking:** Live updates on request progress (Pending -> Accepted -> Completed).
* **Identity Verification:** A structured registration system to ensure a safe and secure environment for vulnerable users.
* **Community Analytics:** A dashboard for administrators to monitor total support hours and active community hotspots.

---

##  Technologies Used
* **Backend:** Python, Flask (Web Framework)
* **Database:** SQLite / MySQL (For user profiles and task management)
* **Frontend:** HTML5, CSS3 (Responsive Design for mobile/desktop use)
* **Version Control:** Git
* **Authentication:** Password hashing and session-based security

---

## Data Handling & Architecture
* **User Management:** Managed through a relational database linking `VolunteerID` and `SeniorID` to specific task logs.
* **Request Lifecycle:** Handled via a centralized `tasks` table that tracks timestamps for faster crisis response analysis.
* **Logic Engine:** Python scripts manage the state of each request, ensuring a task cannot be "double-booked" by multiple volunteers.



---


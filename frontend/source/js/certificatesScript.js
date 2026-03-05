async function getCertificates() {
    try {
        const response = await fetch('/certificates/get');
        const result = await response.json();
        const certificates = result.data;

        let tableContent = "";
        certificates.forEach(cert => {
            let actionBtn = "-";
            const completedDate = cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : "N/A";

            if (cert.status === 'approved') {
                actionBtn = `<a href="/certificates/download/${cert.id}" class="btn btn-primary">Download</a>`;
            } else if (cert.status === 'pending') {
                actionBtn = `<span class="badge bg-warning">In Process</span>`;
            } else if (cert.status === 'issued') {
                actionBtn = `<a href="/certificates/details/${cert.id}" class="btn btn-info">See Details</a>`;
            }

            tableContent += `
                <tr>
                    <td>${cert.Program.nama_program}</td>
                    <td>${completedDate}</td>
                    <td>${cert.status}</td>
                    <td>${actionBtn}</td>
                </tr>
            `;
        });

        document.getElementById("certificatesTable").innerHTML = tableContent;
    } catch (error) {
        console.error("Error fetching certificates:", error);
    }
};

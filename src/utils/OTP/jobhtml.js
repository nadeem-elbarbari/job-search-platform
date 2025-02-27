export const jobHtml = (name, jobTitle, companyName, status) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Application Status</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .message {
            font-size: 18px;
            margin: 20px 0;
            color: #555;
        }
        .status-accepted {
            color: green;
        }
        .status-rejected {
            color: red;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Job Application Update</div>
        <p class="message">
            Dear <strong>${name}</strong>,<br>
            Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been 
            <span class="status-${status}">${status}</span>.
        </p>
        <p class="footer">Thank you for your interest. If you have any questions, feel free to reach out.</p>
    </div>
</body>
</html>
`;
}
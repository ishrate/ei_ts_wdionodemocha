#!/usr/bin/env node

/**
 * Generate Allure r  // Define report paths - organize under allure-report folder
  const baseAllureDir = path.join(reportsDir, 'allure-report');
  const reportName = `allure-report-${timestamp}`;
  const reportPath = path.join(baseAllureDir, reportName);
  const latestPath = path.join(baseAllureDir, 'latest');t with timestamp
 * This script creates a timestamped Allure report for historical tracking
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Generate timestamp in format: YYYY-MM-DD_HH-mm-ss
function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// Generate readable timestamp for display
function generateReadableTimestamp() {
  const now = new Date();
  return now.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/[\/,]/g, '').replace(/\s+/g, '_').replace(/:/g, '-');
}

try {
  const timestamp = generateTimestamp();
  const readableTimestamp = generateReadableTimestamp();
  
  // Create reports directory if it doesn't exist
  const reportsDir = path.join(process.cwd(), 'test-output', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Define report paths - organize under allure-report folder
  const baseAllureDir = path.join(reportsDir, 'allure-report');
  const reportName = `allure-report-${timestamp}`;
  const reportPath = path.join(baseAllureDir, reportName);
  const latestPath = path.join(baseAllureDir, 'latest');

  // Create base allure-report directory if it doesn't exist
  if (!fs.existsSync(baseAllureDir)) {
    fs.mkdirSync(baseAllureDir, { recursive: true });
    console.log(`📁 Created base allure-report directory: ${baseAllureDir}`);
  }
  
  console.log(`🔄 Generating Allure report with timestamp: ${timestamp}`);
  console.log(`📁 Report will be saved to: test-output/reports/allure-report/${reportName}`);
  
  // Generate the timestamped Allure report
  const generateCommand = `npx allure generate test-output/allure-results --clean -o "${reportPath}"`;
  execSync(generateCommand, { stdio: 'inherit' });
  
  // Create a symlink or copy for 'latest' report (for easy access)
  if (fs.existsSync(latestPath)) {
    // Remove existing latest report
    fs.rmSync(latestPath, { recursive: true, force: true });
  }
  
  // Create a copy as 'latest' for consistent access
  execSync(`xcopy "${reportPath}" "${latestPath}" /E /I /H /Y`, { stdio: 'inherit' });
  
  console.log(`✅ Report successfully generated!`);
  console.log(`📊 Timestamped report: test-output/reports/allure-report/${reportName}`);
  console.log(`🔗 Latest report: test-output/reports/allure-report/latest`);
  console.log(`🌐 Open latest: npm run report:open`);
  
  // Create an index file with links to all reports
  createReportIndex(baseAllureDir);
  
} catch (error) {
  console.error(`❌ Error generating report: ${error.message}`);
  process.exit(1);
}

function createReportIndex(baseAllureDir) {
  try {
    // Get all report directories
    const reportDirs = fs.readdirSync(baseAllureDir)
      .filter(dir => dir.startsWith('allure-report-') && fs.statSync(path.join(baseAllureDir, dir)).isDirectory())
      .sort()
      .reverse(); // Latest first

    const indexHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Reports Index</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background-color: #f5f5f5; 
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        h1 { 
            color: #333; 
            text-align: center; 
            margin-bottom: 30px; 
        }
        .report-list { 
            list-style: none; 
            padding: 0; 
        }
        .report-item { 
            margin: 10px 0; 
            padding: 15px; 
            background: #f8f9fa; 
            border-radius: 5px; 
            border-left: 4px solid #007bff; 
        }
        .report-item:hover { 
            background: #e9ecef; 
        }
        .report-link { 
            text-decoration: none; 
            color: #007bff; 
            font-weight: bold; 
            font-size: 16px; 
        }
        .report-date { 
            color: #666; 
            font-size: 14px; 
            margin-top: 5px; 
        }
        .latest-badge {
            background: #28a745;
            color: white;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 12px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 WebdriverIO Test Reports</h1>
        <ul class="report-list">
            ${reportDirs.map((dir, index) => {
              const isLatest = index === 0;
              const timestamp = dir.replace('allure-report-', '');
              const displayDate = timestamp.replace(/_/g, ' ').replace(/-/g, ':');
              
              return `
                <li class="report-item">
                    <a href="./${dir}/index.html" class="report-link">
                        ${dir}
                        ${isLatest ? '<span class="latest-badge">LATEST</span>' : ''}
                    </a>
                    <div class="report-date">Generated: ${displayDate}</div>
                </li>
              `;
            }).join('')}
        </ul>
        
        <div style="margin-top: 30px; text-align: center; color: #666;">
            <p>Total Reports: ${reportDirs.length}</p>
            <p>Framework: WebdriverIO + TypeScript + Allure</p>
        </div>
    </div>
</body>
</html>
    `;

    fs.writeFileSync(path.join(baseAllureDir, 'index.html'), indexHTML);
    console.log(`📋 Report index created: test-output/reports/allure-report/index.html`);
    
  } catch (error) {
    console.log(`⚠️  Could not create report index: ${error.message}`);
  }
}

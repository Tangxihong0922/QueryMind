-- Calculate salary percentile for each employee within departments
SELECT 
    department,
    lastname,
    rate,
    CUME_DIST() OVER (
        PARTITION BY department 
        ORDER BY rate
    ) AS CUME_DIST,
    PERCENT_RANK() OVER (
        PARTITION BY department 
        ORDER BY rate
    ) AS PERCENT_RANK
FROM 
    employeedepartmentrate
WHERE 
    department IN ('Information Services', 'Document Control')
ORDER BY 
    department ASC,
    rate DESC;

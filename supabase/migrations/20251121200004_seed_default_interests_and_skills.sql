-- Seed default interests (all approved)
INSERT INTO interests (name, approved) VALUES
-- Technology & Trends
('Open Source', true),
('Web Development', true),
('Mobile Development', true),
('Cloud Computing', true),
('DevOps', true),
('AI/ML', true),
('Blockchain', true),
('Cybersecurity', true),
('Data Science', true),
('Game Development', true),
('IoT', true),
('AR/VR', true),
-- Community & Learning
('Tech Conferences', true),
('Developer Communities', true),
('Mentoring', true),
('Teaching', true),
('Code Reviews', true),
('Pair Programming', true),
('Tech Writing', true),
('Public Speaking', true),
-- Methodologies
('Agile', true),
('Test-Driven Development', true),
('Continuous Integration', true),
('Microservices', true),
('Serverless Architecture', true)
ON CONFLICT (name) DO NOTHING;

-- Seed default skills (all approved)
INSERT INTO skills (name, approved) VALUES
-- Programming Languages
('JavaScript', true),
('TypeScript', true),
('Python', true),
('Java', true),
('C#', true),
('Go', true),
('Rust', true),
('Ruby', true),
('PHP', true),
('Swift', true),
('Kotlin', true),
('C++', true),
('C', true),
-- Frontend
('React', true),
('Vue.js', true),
('Angular', true),
('Next.js', true),
('Svelte', true),
('HTML/CSS', true),
('Tailwind CSS', true),
('Styled Components', true),
-- Backend
('Node.js', true),
('Express', true),
('Django', true),
('Flask', true),
('Spring Boot', true),
('Rails', true),
('FastAPI', true),
('GraphQL', true),
('REST APIs', true),
-- Databases
('PostgreSQL', true),
('MySQL', true),
('MongoDB', true),
('Redis', true),
('SQLite', true),
('DynamoDB', true),
-- Cloud & DevOps
('AWS', true),
('Azure', true),
('GCP', true),
('Docker', true),
('Kubernetes', true),
('Terraform', true),
('CI/CD', true),
('GitHub Actions', true),
('GitLab CI', true),
-- Tools
('Git', true),
('GitHub', true),
('GitLab', true),
('VS Code', true),
('Vim', true),
('Linux', true),
('Bash', true),
('npm/yarn/pnpm', true)
ON CONFLICT (name) DO NOTHING;


Chappy 

Chappy är en chattapp där man kan skriva i kanaler och skicka direktmeddelanden. Kanaler kan vara öppna för alla eller låsta för inloggade användare. En AI-funktion sammanfattar konversationen i en kanal.

Publicerad app: https://chappy-uzji.onrender.com

Funktioner
Läsa och skriva i öppna kanaler, även som gäst
Registrera konto och logga in
Läsa och skriva i låsta kanaler som inloggad
Skicka direktmeddelanden till andra användare som inloggad
AI-sammanfattning av konversationen i en kanal
Skapa kanal, öppen eller låst
Ta bort kanaler som man själv har skapat
Ta bort sitt eget konto
Tekniker
Frontend: React, TypeScript, Vite, React Router, Zustand
Backend: Node.js, Express, TypeScript
Databas: AWS DynamoDB
Inloggning: JWT och bcrypt för hashade lösenord
Validering: Zod, delad mellan frontend och backend
AI: Google Gemini
Publicering: Render
Installation och start

bash
git clone https://github.com/henrik-lund/Chappy.git
cd Chappy
npm install
npm run restart-server

Öppna sedan http://localhost:3001

Environment-variabler

Appen behöver en .env-fil i rotmappen med följande:

PORT=3001
ACCESS_KEY=
SECRET_ACCESS_KEY=
AWS_REGION=eu-north-1
TABLE_NAME=chappy
JWT_SECRET=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash


Gratisversionen av Render kan ta upp till en minut att starta första gången appen öppnas.
Gäster kan läsa och skriva i öppna kanaler. Låsta kanaler och direktmeddelanden kräver inloggning.
Knappen Kanalinställningar, där man tar bort en kanal, syns bara för den som skapat kanalen.
Kontoinställningar öppnas med kugghjulet vid användarnamnet längst ner i sidomenyn.
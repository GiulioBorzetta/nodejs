# PROGETTO NODEJS

## Cosa Serve per avviarlo?

- MYSQL, per importare i file presenti all interno della cartella 'MYSQL'
- postman, é possibile utilizzarlo sia sul browser che scaricarlo sul proprio pc (serve per poter inviare informazioni al server e vedere come si comporta)
- NODEJS, senza questo non é possibile avviare il codice
- creare un file .env, inserendo le credenziali del proprio database e la porta che si vuole usare (sennó partirá in automatico con la porta 3000)

questa é l'impostazione di come dovrebbe essere il file .env, quando si andrá a creare:

`DB_HOST=yourHost
DB_USER=yourUser
DB_PASSWORD=yourPassword
DB_NAME=yourDatabase
PORT=yourPort`


## Come é costituito il codice?

é possibile suddividerlo in parti:
- La parte del post, dove é possibile vedere, inserire, modificare e cancellare i posts
- La parte del user, dove é possibile vedere, inserire, modificare e cancellare gli users
- La parte del interaction, dove é possibile vedere, inserire, modificare e cancellare le interactions
- La parte finale dove é possibile vedere altre informazioni in combinazione tra user, post e interaction

## Come testare il codice?

per avviare il codice bisognerá scrivere il seguente comanado `node app.js`. Appena avviato non mostrerá nulla, ma andando negli url che si possono trovare qua sotto, aprirá pagine in formato json che ti permetteranno di vedere quello che é presente all'interno del database

`http://localhost:3000/users` -> Per vedere ed inserire gli users

quando si inseriscono dei dati all interno del database, attraverso postman per esempio, questa deve essere l'impostazione che deve rispettare per non causare alcun tipo di errore:
`{
  "title": "Title",
  "insertion_date": "YYYY-MM-DD"
}`

`http://localhost:3000/users/:id` -> Per eliminare, modificare delle informazioni

`http://localhost:3000/posts` -> Per vedere ed inserire i posts

quando si inseriscono dei dati all interno del database, attraverso postman per esempio, questa deve essere l'impostazione che deve rispettare per non causare alcun tipo di errore:
`{
  "nickname": "name",
  "age": number,
  "city": "city"
}`

`http://localhost:3000/posts/:id` -> Per eliminare, modificare delle informazioni

`http://localhost:3000/interactions` -> Per vedere ed inserire le interactions

quando si inseriscono dei dati all interno del database, attraverso postman per esempio, questa deve essere l'impostazione che deve rispettare per non causare alcun tipo di errore:
`{
  "post_id": id,
  "user_id": id,
  "interaction_type": "like" or "comment",
  "interaction_time": "YYYY-MM-DD"
}`

`http://localhost:3000/interactions/:id` -> Per eliminare, modificare delle informazioni

`http://localhost:3000/interactions/aggregate?city=NOMECITTA&interaction_date=YYYY-MM-DD` -> Per cercare di visualizzare tutti i post con gli aggregati delle interazioni, di filtrare i post per data e di filtrare le interazioni aggregate dei post per città e data di interazione

`http://localhost:3000/interactions/aggregate?city=Barcellona&interaction_date=2024-11-08` -> Esempio

## Test

Nel codice é stato introdotto una fase di test con l aiuto di Sinon e che permette di verificare 12 test. 
I test non sarebbbero altro dei controlli che va a fare con le API, per controllare che il GET, POST, PUT e DELETE funzioni correttamente.

Per poter avviare il test bisognerá scrivere nel terminale la stringa `npm test` cominciando a fare il controllo e se fosse andato tutto bene, mostrerá che ha passato 12 test

## Per far funzionare il codice, cosa é stato inserito?

- mysql2, per poter collegare il database alla parte di backend
- dotenv, per permettere l'inserimento delle credenziali dal file .env ad un file js
- express-validator, permette di fare un controllo prima che i dati vengano inseriti, consentendo di non incorrere in errori per via del formato
- express, é un framework che semplifica la creazione di applicazioni ed API

## Informazioni aggiuntive

All interno dei file di MYSQL sono giá presenti dei valori, per poter giá controllare che funzioni tutto perfettamente

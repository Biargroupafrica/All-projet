# Skill : AI Service — ACTOR Hub

## Scénario d'utilisation
Développer le microservice IA (`services/ai-service/`) — Python/FastAPI.

## Fonctionnalités

### Transcription Audio → Texte
- Modèle : OpenAI Whisper (large-v3) ou Whisper local
- Langues supportées : FR, EN, ES, AR, PT, DE, ZH, RU, SW, AM (aligné avec l'app)
- Format d'entrée : MP3, WAV, OGG, M4A, WebM
- Sortie : texte + timestamps + segments
- Latence cible : < 30s pour un appel de 5 minutes

### Analyse de Sentiment
- Modèle : camembert-base (FR), bert-base-multilingual (autres langues)
- Score : -1.0 (très négatif) à +1.0 (très positif)
- Granularité : par segment temporel (30s) + score global
- Mots-clés émotionnels détectés

### Chatbot NLP
- Framework : Rasa NLU ou modèle fine-tuné
- Détection d'intentions + extraction d'entités
- Multi-langue (10 langues)
- Pipeline : intent → entités → action → réponse
- Fallback vers agent humain si confiance < seuil

### Résumé Automatique d'Appels
- Modèle : GPT-4o-mini ou Mistral (via API)
- Entrée : transcription complète
- Sortie : résumé structuré (sujet, décision, prochaine étape)

### Détection de Langue
- Identification automatique de la langue parlée
- Basculement automatique du chatbot selon langue détectée

## Structure de Fichiers

```
services/ai-service/
├── main.py                     # FastAPI app entry point
├── config/
│   ├── settings.py             # Pydantic Settings
│   └── models.py               # Chargement des modèles ML (lazy loading)
├── routers/
│   ├── transcription.py        # POST /transcription
│   ├── sentiment.py            # POST /sentiment
│   ├── chatbot.py              # POST /chatbot/message
│   ├── summary.py              # POST /summary
│   └── language.py             # POST /language/detect
├── services/
│   ├── whisper_service.py
│   ├── sentiment_service.py
│   ├── chatbot_service.py
│   ├── summary_service.py
│   └── storage_service.py      # Téléchargement fichiers S3
├── consumers/
│   └── kafka_consumer.py       # Écoute callcenter.recordings.new
├── models/                     # Modèles ML téléchargés/cached
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## Endpoints API

```
POST /transcription              # Transcription audio (upload file ou URL S3)
POST /sentiment                  # Analyse sentiment d'un texte
POST /sentiment/real-time        # Sentiment en streaming (chunks)
POST /chatbot/message            # Réponse chatbot NLP
POST /summary                    # Résumé d'appel
POST /language/detect            # Détection langue
GET  /health                     # Health check avec statut modèles
```

## Critères de Succès

- [ ] Transcription d'un fichier WAV de 5 min en < 30s
- [ ] Score de sentiment correct sur textes de test
- [ ] Chatbot répond correctement à 5 intentions configurées
- [ ] Résumé d'appel structuré généré en < 10s
- [ ] Détection langue correcte pour FR, EN, AR

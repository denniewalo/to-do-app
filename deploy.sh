GOOGLE_PROJECT_ID=vm-tutorial-310919
CLOUD_RUN_SERVICE=vm-tutorial-service
INSTANCE_CONNECTION_NAME=vm-tutorial-310919:europe-west3:vmtutorial
DB_USER=root
DB_PASS=DennieAlex
DB_NAME=to_do_app

gcloud builds submit --tag gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_RUN_SERVICE \
  --project=$GOOGLE_PROJECT_ID

gcloud run deploy $CLOUD_RUN_SERVICE \
  --image gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_RUN_SERVICE \
  --add-cloudsql-instances $INSTANCE_CONNECTION_NAME \
  --update-env-vars INSTANCE_CONNECTION_NAME=$INSTANCE_CONNECTION_NAME, DB_PASS=$DB_PASS, DB_USER=$DB_USER, DB_NAME=$DB_NAME \
  --platform managed \
  --region europe-west3-a \
  --allow-unauthenticated \
  --project=$GOOGLE_PROJECT_ID
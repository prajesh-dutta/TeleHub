# GCP Setup Commands

## 1. Install Google Cloud CLI
Download from: https://cloud.google.com/sdk/docs/install

## 2. Authenticate and Set Project
```bash
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
```

## 3. Enable Required APIs
```bash
gcloud services enable storage-googleapis.com
gcloud services enable iam.googleapis.com
```

## 4. Create Service Account
```bash
gcloud iam service-accounts create telehub-storage \
    --display-name="TeleHub Storage Service" \
    --description="Service account for TeleHub movie storage"
```

## 5. Grant Permissions
```bash
gcloud projects add-iam-policy-binding [YOUR_PROJECT_ID] \
    --member="serviceAccount:telehub-storage@[YOUR_PROJECT_ID].iam.gserviceaccount.com" \
    --role="roles/storage.admin"
```

## 6. Create and Download Service Account Key
```bash
gcloud iam service-accounts keys create telehub-service-account.json \
    --iam-account=telehub-storage@[YOUR_PROJECT_ID].iam.gserviceaccount.com
```

Then move the downloaded file to: `d:\Downloads\TeleHub\TeleHub\config\telehub-service-account.json`

## 7. Create Storage Bucket
```bash
gsutil mb -p [YOUR_PROJECT_ID] -c STANDARD -l asia-south1 gs://telehub-movies-[YOUR_PROJECT_ID]
```

## 8. Set Bucket Permissions
```bash
gsutil iam ch serviceAccount:telehub-storage@[YOUR_PROJECT_ID].iam.gserviceaccount.com:objectAdmin gs://telehub-movies-[YOUR_PROJECT_ID]
```

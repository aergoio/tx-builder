# Aergo Transaction Builder

This is a clicky UI to create Aergo transactions and also sign or send them using Aergo Connect.

## Development

1. Install dependencies: `yarn`
2. Build editor workers: `./build_workers.sh`
3. Build dev `yarn serve` or prod `yarn build`

## Deployment

```
PROFILE=awscli_profile_name BUCKET_NAME=s3_bucket_name yarn deploy:s3
PROFILE=awscli_profile_name DISTRIBUTION_ID=cloudfront_distribution_id yarn cloudfront
```
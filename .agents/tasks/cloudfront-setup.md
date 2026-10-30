# CloudFront + OAC for private book PDFs

Serves the PRIVATE S3 bucket `ibrahimaraji-book-pdfs` over HTTPS via CloudFront using
Origin Access Control (OAC). The bucket stays private (all 4 public-access blocks remain
enabled); only this CloudFront distribution can read objects.

## Resources created

| Item | Value |
|------|-------|
| AWS account | 445476945051 (region us-east-1) |
| S3 bucket (private) | ibrahimaraji-book-pdfs |
| Bucket regional domain | ibrahimaraji-book-pdfs.s3.us-east-1.amazonaws.com |
| Origin Access Control Id | **E3VDLA9421C496** (Name: `ibrahimaraji-book-pdfs-oac`, sigv4 / always / s3) |
| CloudFront Distribution Id | **E1O6N1TD3WGDVJ** |
| Distribution ARN | arn:aws:cloudfront::445476945051:distribution/E1O6N1TD3WGDVJ |
| **Distribution DomainName** | **d359854tktotd7.cloudfront.net** |
| Distribution status | Deployed |

### Distribution config highlights
- Origin `s3-book-pdfs` -> bucket regional domain, S3OriginConfig with empty
  OriginAccessIdentity, OriginAccessControlId = E3VDLA9421C496, OriginShield disabled.
- DefaultCacheBehavior: TargetOriginId `s3-book-pdfs`, ViewerProtocolPolicy
  `redirect-to-https`, AllowedMethods GET+HEAD, Compress true, AWS managed
  CachingOptimized cache policy `658327ea-f89d-4fab-a63d-7e88639e58f6`.
- Enabled, Comment "ibrahimaraji book PDFs", DefaultRootObject empty,
  PriceClass PriceClass_100.

## Bucket policy applied

Grants only this distribution read access (service principal + SourceArn condition).
Applied with `s3api put-bucket-policy`; public access block left untouched.

```json
{
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": { "Service": "cloudfront.amazonaws.com" },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::ibrahimaraji-book-pdfs/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "arn:aws:cloudfront::445476945051:distribution/E1O6N1TD3WGDVJ"
                }
            }
        }
    ]
}
```

## HEAD test results (PowerShell Invoke-WebRequest)

| URL | StatusCode | Content-Type | Content-Length |
|-----|-----------|--------------|----------------|
| https://d359854tktotd7.cloudfront.net/books/the-true-promise.pdf | 200 | application/pdf | 2577652 |
| https://d359854tktotd7.cloudfront.net/books/my-village-memory-and-longing.pdf | 200 | application/pdf | 12612625 |

Content-Length values match the S3 object sizes. Bucket remains private; access works
only through CloudFront (OAC-signed requests).

Objects available under `/books/`:
`diary-of-a-muslim.pdf`, `diary-of-time-my-memories.pdf`, `in-the-embrace-of-islam.pdf`,
`my-village-memory-and-longing.pdf`, `the-true-promise.pdf`.

## Next step for the app owner — Amplify rewrite

Add this rewrite rule in the Amplify app so `/books/*.pdf` forwards to CloudFront:

- source: `/books/<*>`
- target: `https://d359854tktotd7.cloudfront.net/books/<*>`
- type: `200 (Rewrite)`

After adding it, the site can reference `/books/<slug>.pdf` and Amplify will serve the
PDF from CloudFront over HTTPS.

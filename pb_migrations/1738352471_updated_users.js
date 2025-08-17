/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "otp": {
      "emailTemplate": {
        "body": "<html>\n  <body>\n    <div\n      style='background-color:#ffffff;color:#FFFFFF;font-family:\"Iowan Old Style\", \"Palatino Linotype\", \"URW Palladio L\", P052, serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'\n    >\n      <table\n        align=\"center\"\n        width=\"100%\"\n        style=\"margin:0 auto;max-width:600px;background-color:#ffffff\"\n        role=\"presentation\"\n        cellspacing=\"0\"\n        cellpadding=\"0\"\n        border=\"0\"\n      >\n        <tbody>\n          <tr style=\"width:100%\">\n            <td>\n              <div style=\"padding:24px 24px 24px 24px;text-align:center\">\n                <img\n                  alt=\"\"\n                  src=\"https://www.diane.app/web/image/website/1/logo/diane?unique=3d9e046\"\n                  height=\"24\"\n                  style=\"height:24px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%\"\n                />\n              </div>\n              <div\n                style=\"color:#000000;font-size:16px;font-weight:normal;text-align:center;padding:16px 24px 16px 24px\"\n              >\n                Here is your one-time passcode:\n              </div>\n              <h1\n                style='color:#000000;font-weight:bold;text-align:center;margin:0;font-family:\"Nimbus Mono PS\", \"Courier New\", \"Cutive Mono\", monospace;font-size:32px;padding:16px 24px 16px 24px'\n              >\n                {OTP}\n              </h1>\n              <div\n                style=\"color:#868686;font-size:16px;font-weight:normal;text-align:center;padding:16px 24px 16px 24px\"\n              >\n                This code will expire in 5 minutes.\n              </div>\n              <div\n                style=\"color:#868686;font-size:14px;font-weight:normal;text-align:center;padding:16px 24px 16px 24px\"\n              >\n                Problems? Just reply to this email.\n              </div>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </body>\n</html>"
      }
    }
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "otp": {
      "emailTemplate": {
        "body": "<html>\n  <body>\n    <div\n      style='background-color:#ffffff;color:#FFFFFF;font-family:\"Iowan Old Style\", \"Palatino Linotype\", \"URW Palladio L\", P052, serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'\n    >\n      <table\n        align=\"center\"\n        width=\"100%\"\n        style=\"margin:0 auto;max-width:600px;background-color:#ffffff\"\n        role=\"presentation\"\n        cellspacing=\"0\"\n        cellpadding=\"0\"\n        border=\"0\"\n      >\n        <tbody>\n          <tr style=\"width:100%\">\n            <td>\n              <div style=\"padding:24px 24px 24px 24px;text-align:center\">\n                <img\n                  alt=\"\"\n                  src=\"https://diane1.odoo.com/web/image/website/1/logo/diane?unique=8ad54c2\"\n                  height=\"24\"\n                  style=\"height:24px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%\"\n                />\n              </div>\n              <div\n                style=\"color:#000000;font-size:16px;font-weight:normal;text-align:center;padding:16px 24px 16px 24px\"\n              >\n                Here is your one-time passcode:\n              </div>\n              <h1\n                style='color:#000000;font-weight:bold;text-align:center;margin:0;font-family:\"Nimbus Mono PS\", \"Courier New\", \"Cutive Mono\", monospace;font-size:32px;padding:16px 24px 16px 24px'\n              >\n                {OTP}\n              </h1>\n              <div\n                style=\"color:#868686;font-size:16px;font-weight:normal;text-align:center;padding:16px 24px 16px 24px\"\n              >\n                This code will expire in 5 minutes.\n              </div>\n              <div\n                style=\"color:#868686;font-size:14px;font-weight:normal;text-align:center;padding:16px 24px 16px 24px\"\n              >\n                Problems? Just reply to this email.\n              </div>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </body>\n</html>"
      }
    }
  }, collection)

  return app.save(collection)
})

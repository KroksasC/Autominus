import "../Styles/Posting.css"
function Posting() {
    return (
        <form className="main">
            <label className="container">Accident History <input type="text" name="accidentHistory" /></label>
            <label className="container">Body Type<input type="text" name="bodyType" /></label>
            <label className="container">Brand<input type="text" name="brand" /></label>
            <label className="container">Condition<input type="text" name="condition" /></label>
            <label className="container">Doors<input type="text" name="doors" /></label>
            <label className="container">Engine Capacity<input type="text" name="engineCapacity" /></label>
            <label className="container">Horsepower<input type="text" name="horsepower" /></label>
            <label className="container">Image Urls<input type="text" name="imageUrls" /></label>
            <label className="container">Location<input type="text" name="location" /></label>
            <label className="container">Model<input type="text" name="model" /></label>
            <label className="container">Negotiable<input type="text" name="negotiable" /></label>
            <label className="container">Year<input type="number" name="year" /></label>
            <label className="container">Price<input type="number" name="price" /></label>
            <label className="container">Description<textarea name="description" /></label>
            <label className="container">Mileage<input type="number" name="mileage" /></label>
            <label className="container">Color<input type="text" name="color" /></label>
            <label className="container">Fuel Type<input type="text" name="fuelType" /></label>
            <label className="container">Transmission<input type="text" name="transmission" /></label>
            <label className="container">Drivetrain<input type="text" name="drivetrain" /></label>
            <label className="container">Registration Number<input type="text" name="registrationNumber" /></label>
            <label className="container">Seats<input type="text" name="seats" /></label>
            <label className="container">Vin<input type="text" name="vin" /></label>
            <label className="container">Technical Inspection Valid Until<input type="text" name="technicalInspectionValidUntil" /></label>

            <div className="buttons container">
                <button className="Cancel">Cancel</button>
                <button className="Add">Post</button>
            </div>
        </form>
    );
}

export default Posting;
